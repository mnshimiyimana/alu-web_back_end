import readDatabase from '../utils';

export default class StudentsController {
  static async getAllStudents(res) {
    try {
      const path = process.argv[2];
      const data = await readDatabase(path);

      const lines = data
        .toString()
        .split('\n')
        .filter((line) => line.length > 0)
        .slice(1);
      const fields = lines.map((line) => line.split(','));

      const fieldMap = new Map();
      fields.forEach((field) => {
        const [name, , , fieldOfStudy] = field;
        if (!fieldMap.has(fieldOfStudy)) {
          fieldMap.set(fieldOfStudy, []);
        }
        fieldMap.get(fieldOfStudy).push(name);
      });

      let returnText = 'This is the list of our students\n';
      fieldMap.forEach((students, field) => {
        returnText += `Number of students in ${field}: ${
          students.length
        }. List: ${students.join(', ')}\n`;
      });

      return res.status(200).end(returnText.trim());
    } catch (error) {
      return res.status(500).end('Cannot load the database');
    }
  }

  static async getAllStudentsByMajor(req, res) {
    const { major } = req.params;
    if (major !== 'CS' && major !== 'SWE') {
      return res.status(500).end('Major parameter must be CS or SWE');
    }

    try {
      const path = process.argv[2];
      const data = await readDatabase(path);

      const lines = data
        .toString()
        .split('\n')
        .filter((line) => line.length > 0)
        .slice(1);
      const majorStudents = lines.filter(
        (line) => line.split(',')[3] === major,
      );
      const students = majorStudents.map((student) => student.split(',')[0]);
      const responseText = `List: ${students.join(', ')}`;
      return res.status(200).end(responseText);
    } catch (error) {
      return res.status(500).end('Cannot load the database');
    }
  }
}
