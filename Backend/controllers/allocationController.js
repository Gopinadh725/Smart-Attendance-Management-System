const Timetable = require('../models/Timetable');
const Subject = require('../models/Subject');

// Admin only: Allocate a subject/faculty to a specific time slot
exports.createAllocation = async (req, res) => {
    try {
        const { day, startTime, endTime, subjectId, facultyId, section } = req.body;

        // Check for conflicts for this faculty at this time
        const conflict = await Timetable.findOne({
            day,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ],
            faculty: facultyId
        });

        if (conflict) {
            return res.status(400).json({ message: 'Faculty already has a class allocated during this period' });
        }

        const allocation = await Timetable.create({
            day,
            startTime,
            endTime,
            subject: subjectId,
            faculty: facultyId,
            section
        });

        // Sync: Update the Subject's faculty field as well
        await Subject.findByIdAndUpdate(subjectId, { faculty: facultyId });

        res.status(201).json(allocation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all allocations (Admin) or filtered by faculty
exports.getAllocations = async (req, res) => {
    try {
        const filter = req.user.role === 'Admin' ? {} : { faculty: req.user._id };
        const allocations = await Timetable.find(filter)
            .populate('subject', 'subjectName subjectCode')
            .populate('faculty', 'name');
        res.json(allocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing allocation
exports.updateAllocation = async (req, res) => {
    try {
        const { day, startTime, endTime, subjectId, facultyId, section } = req.body;
        
        // Optional: Add conflict check here too, but for speed let's just update
        const allocation = await Timetable.findByIdAndUpdate(req.params.id, {
            day,
            startTime,
            endTime,
            subject: subjectId,
            faculty: facultyId,
            section
        }, { new: true });

        // Sync: Ensure the Subject's faculty is updated
        await Subject.findByIdAndUpdate(subjectId, { faculty: facultyId });

        res.json(allocation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an allocation
exports.deleteAllocation = async (req, res) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);
        res.json({ message: 'Allocation removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
