const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const User = require('../models/User');
const ExcelJS = require('exceljs');

// @desc    Export attendance to Excel
// @route   GET /api/reports/export/:subjectId
// @access  Private/Faculty/Admin
exports.exportToExcel = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const attendances = await Attendance.find({ subject: req.params.subjectId })
            .populate('students.studentId', 'name rollNumber')
            .sort({ date: 1 });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance Report');

        // Define columns
        const columns = [
            { header: 'Roll Number', key: 'rollNumber', width: 15 },
            { header: 'Student Name', key: 'name', width: 30 }
        ];

        // Add date columns
        attendances.forEach(record => {
            columns.push({ 
                header: record.date.toLocaleDateString(), 
                key: record._id.toString(), 
                width: 15 
            });
        });

        columns.push({ header: 'Total Present', key: 'totalPresent', width: 15 });
        columns.push({ header: 'Attendance %', key: 'percentage', width: 15 });

        worksheet.columns = columns;

        // Get all enrolled students
        const students = await User.find({ _id: { $in: subject.enrolledStudents } });
        console.log(`[DEBUG] Exporting attendance for subject: ${subject.subjectCode}, Students: ${students.length}`);

        students.forEach(student => {
            const rowData = {
                rollNumber: student.rollNumber || 'N/A',
                name: student.name
            };

            let presentCount = 0;
            attendances.forEach(record => {
                const studentAttendance = record.students.find(s => 
                    s.studentId && s.studentId._id && s.studentId._id.toString() === student._id.toString()
                );
                const isPresent = studentAttendance && studentAttendance.status === 'Present';
                rowData[record._id.toString()] = isPresent ? 'P' : 'A';
                if (isPresent) presentCount++;
            });

            rowData.totalPresent = presentCount;
            rowData.percentage = attendances.length > 0 
                ? ((presentCount / attendances.length) * 100).toFixed(2) + '%' 
                : '0%';

            worksheet.addRow(rowData);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Attendance_${subject.subjectCode}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get raw report data for client-side generation
// @route   GET /api/reports/data/:subjectId
// @access  Private/Faculty/Admin/Student
exports.getReportData = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.subjectId).populate('faculty', 'name');
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const userId = req.user._id || req.user.id;

        // If student, check enrollment
        if (req.user.role === 'Student') {
            const isEnrolled = subject.enrolledStudents.some(id => id.toString() === userId.toString());
            if (!isEnrolled) {
                return res.status(403).json({ message: 'Not enrolled in this subject' });
            }
        }

        let attendances = await Attendance.find({ subject: req.params.subjectId })
            .populate('students.studentId', 'name rollNumber')
            .sort({ date: 1 });

        let enrolledStudents;

        if (req.user.role === 'Student') {
            // For students, only return their own record
            enrolledStudents = await User.find({ _id: userId }).select('name rollNumber section semester');
            
            // Filter nested attendance data to only include this student
            attendances = attendances.map(record => {
                const studentAtt = record.students.find(s => 
                    s.studentId && (s.studentId._id?.toString() === userId.toString() || s.studentId.toString() === userId.toString())
                );
                return {
                    ...record.toObject(),
                    students: studentAtt ? [studentAtt] : []
                };
            });
        } else {
            // For Admin/Faculty, return all enrolled students
            enrolledStudents = await User.find({ 
                _id: { $in: subject.enrolledStudents },
                role: 'Student'
            }).select('name rollNumber section semester');
        }

        res.json({
            subject,
            attendances,
            enrolledStudents
        });
    } catch (error) {
        console.error("Report Data Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export attendance to PDF
// @route   GET /api/reports/export/pdf/:subjectId
// @access  Private/Faculty/Admin
exports.exportToPDF = async (req, res) => {
    try {
        const { jsPDF } = require('jspdf');
        require('jspdf-autotable');
        
        const subject = await Subject.findById(req.params.subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const attendances = await Attendance.find({ subject: req.params.subjectId })
            .populate('students.studentId', 'name rollNumber')
            .sort({ date: 1 });

        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for more dates
        
        // Add Title
        doc.setFontSize(22);
        doc.setTextColor(79, 70, 229); // Indigo 600
        doc.text(`Attendance Report: ${subject.subjectName}`, 14, 20);
        
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Subject Code: ${subject.subjectCode} | Section: ${subject.section}`, 14, 30);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 37);

        // Prepare Table Data
        const students = await User.find({ _id: { $in: subject.enrolledStudents } });
        
        const head = [['Roll No', 'Name']];
        attendances.forEach(record => {
            head[0].push(record.date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }));
        });
        head[0].push('Avg %');

        const body = students.map(student => {
            const row = [student.rollNumber || 'N/A', student.name];
            let presentCount = 0;
            attendances.forEach(record => {
                const studentAttendance = record.students.find(s => s.studentId && s.studentId._id && s.studentId._id.toString() === student._id.toString());
                const isPresent = studentAttendance && studentAttendance.status === 'Present';
                row.push(isPresent ? 'P' : 'A');
                if (isPresent) presentCount++;
            });
            row.push(attendances.length > 0 ? ((presentCount / attendances.length) * 100).toFixed(0) + '%' : '0%');
            return row;
        });

        doc.autoTable({
            head: head,
            body: body,
            startY: 45,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 7, cellPadding: 2 },
            alternateRowStyles: { fillColor: [249, 250, 251] },
            margin: { left: 14, right: 14 }
        });

        const pdfBuffer = doc.output('arraybuffer');
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Attendance_${subject.subjectCode}.pdf`);
        res.send(Buffer.from(pdfBuffer));
    } catch (error) {
        console.error("PDF Export Error:", error);
        res.status(500).json({ message: error.message });
    }
};