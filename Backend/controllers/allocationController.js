const Timetable = require('../models/Timetable');
const Subject = require('../models/Subject');

exports.createAllocation = async (req, res) => {
    try {
        const { date, day, startTime, endTime, subjectId, facultyId, section } = req.body;

        // Conflict check updated to include specific date
        const conflict = await Timetable.findOne({
            date: new Date(date),
            day,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ],
            faculty: facultyId
        });

        if (conflict) {
            return res.status(400).json({ message: 'Faculty already has a class on this specific date and time.' });
        }

        const allocation = await Timetable.create({
            date: new Date(date),
            day,
            startTime,
            endTime,
            subject: subjectId,
            faculty: facultyId,
            section
        });

        await Subject.findByIdAndUpdate(subjectId, { faculty: facultyId });
        res.status(201).json(allocation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllocations = async (req, res) => {
    try {
        const filter = req.user.role === 'Admin' ? {} : { faculty: req.user._id };
        const allocations = await Timetable.find(filter)
            .sort({ date: 1, startTime: 1 }) // Sorting by date for better view
            .populate('subject', 'subjectName subjectCode')
            .populate('faculty', 'name');
        res.json(allocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAllocation = async (req, res) => {
    try {
        const { date, day, startTime, endTime, subjectId, facultyId, section } = req.body;
        
        const allocation = await Timetable.findByIdAndUpdate(req.params.id, {
            date: new Date(date),
            day,
            startTime,
            endTime,
            subject: subjectId,
            faculty: facultyId,
            section
        }, { new: true });

        await Subject.findByIdAndUpdate(subjectId, { faculty: facultyId });
        res.json(allocation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAllocation = async (req, res) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);
        res.json({ message: 'Allocation removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};