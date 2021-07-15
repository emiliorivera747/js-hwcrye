class Student {
  constructor(name, enrolled = false) {
    this.name = name;
    this.enrolled = enrolled;
  }

  notify(message) {
    return new Promise(resolve => {
      resolve(this.name + ' received message: ' + message);
    });
  }

  isEnrolledSlow(delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.enrolled) reject('Already Enrolled');
        else resolve(null);
      }, delay);
    });
  }
}

const students = Array();
students.push(
  new Student('NameA'),
  new Student('NameB'),
  new Student('NameC'),
  new Student('NameD')
);

//Class that defines our data. equiped with a toString method.
class Course {
  constructor(
    name = 'CS0000',
    enrolled = 0,
    capacity = 25,
    seats,
    instructor,
    interstedStudents
  ) {
    this.name = name;
    this.enrolled = enrolled;
    this.capacity = capacity;
    this.seats = seats;
    this.instructor = instructor;
    this.interstedStudents = interstedStudents;
  }

  //Add type in the TS version
  toString() {
    return (
      this.name +
      ' Enrolled: ' +
      this.enrolled +
      ' Capacity: ' +
      this.capacity +
      ' Seats: ' +
      this.seats +
      ' Instructor: ' +
      this.instructor
    );
  }

  // Slow step 2 -- veryfying that the class has sufficient space --> error, course
  checkSpaceSlow(delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.capacity > this.enrolled) resolve(null);
        else reject('Class is full');
      }, delay);
    });
  }
}

const course1 = new Course('CS2114', 100, 105, '0001', 'Esakia', students);

console.log(course1.toString());
// fields are directly accessible.
console.log(course1.name);

// Another way to create an object except this one is in the form of a JSON
// JSON objects can have method declarations in the body that can reference other fields using this.
const course2 = {
  name: 'CS2104',
  enrolled: 51,
  capacity: 52,
  seats: 55,
  instructor: 'Esakia',
  interstedStudents: students,
  toString: function() {
    return (
      this.name +
      ' Enrolled: ' +
      this.enrolled +
      ' Capacity: ' +
      this.capacity +
      ' Seats: ' +
      this.seats +
      ' Instructor: ' +
      this.instructor
    );
  },
  checkSpaceSlow: function(delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.capacity > this.enrolled) resolve(null);
        else reject('Class is full');
      });
    }, delay);
  }
};

// This array declaration treats the courses created in a different way equally.
let courses = new Array();
courses.push(course1, course2);

// Accessing fields is the same
console.log(courses[0].name + ' ' + courses[1].name);

// And the function too.
console.log(course2.toString());

function resultOfSearch(result) {
  console.log('Search result is: ' + result.name);
}

function slowClassSearch(arrayOfCourses, courseName) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = arrayOfCourses.find(course => course.name === courseName);
      resolve(result);
    }, 1000);
  });
}

slowClassSearch(courses, 'CS2104').then(result => {
  resultOfSearch(result)
    .then()
    .catch(err => {
      console.log(err);
    });
});

slowClassSearch(courses, 'CS2114').then(result => {
  console.log('Result inside anonymous function:', result.name).catch(err => {
    console.log(err);
  });
});

function slowAddCourse(course, arrayOfCourses) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (course instanceof Course) {
        arrayOfCourses.push(course);
        resolve(arrayOfCourses);
      } else reject('Error, not a course.');
    }, 1000);
  });
}

// Param 1: Instantiating and passing a wrong Class object
// Param 2: the array containing courses
// Param 3: success callback function defined inline
// Param 4: error callback function defined inline
slowAddCourse(
  {
    seats: 3,
    instructor: 'Esakia'
  },
  courses,
  (error, result) => {
    if (error) console.log(error);
    else console.log('Course count', result.length);
  }
)
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });

// Param 1: Instantiating and passing -- seemingly correct -- Class object
// Param 2: the array containing courses
// Param 3: success callback function defined inline
// Param 4: error callback function defined inline
slowAddCourse(
  {
    name: 'CS2204',
    enrolled: 49,
    capacity: 53,
    seats: 55,
    instructor: 'Esakia',
    interstedStudents: students,
    toString: function(delay, callback) {
      return (
        this.name +
        ' Enrolled: ' +
        this.enrolled +
        ' Capacity: ' +
        this.capacity +
        ' ID: ' +
        this.id +
        ' Instructor: ' +
        this.instructor
      );
    },
    checkSpaceSlow: function() {
      setTimeout(() => {
        if (this.capacity > this.enrolled) callback(null, this);
        else callback('Class is full', null);
      }, delay);
    }
  },
  courses,
  (error, result) => {
    if (error) console.log(error);
    else console.log('Course count', result.length);
  }
)
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });

// The output says 'Error not a course' again.
// This happens because our JSON object does not claim to be of type Class.

// Workaround #1: instantiating object with 'class Course' counstructor.

slowAddCourse(
  new Course('CS2314', 105, 107, 110, 'Esakia'),
  courses,
  (error, result) => {
    if (error) console.log(error);
    else console.log('Course count', result.length);
  }
).then(result => {
  console.log('Course count', result.length);
});

//This works and outptus 'Course count 3'

// Workaround #2: create a JSON that claims to be of type Course

let course4 = Object.assign(Object.create(Course.prototype), {
  name: 'CS2304',
  enrolled: 49,
  capacity: 57,
  seats: 60,
  instructor: 'Esakia',
  interstedStudents: students,
  toString: function() {
    return (
      this.name +
      ' Enrolled: ' +
      this.enrolled +
      ' Capacity: ' +
      this.capacity +
      ' Size ' +
      this.size +
      ' Instructor: ' +
      this.instructor
    );
  }
});

slowAddCourse(course4, courses, (error, result) => {
  if (error) console.log(error);
  else console.log('Course count', result.length);
}).then(result => {
  console.log('Course count', result.length);
});

function slowIncrement(delay, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      course.enrolled++;

      if (course.capacity !== course.enrolled) {
        resolve(
          course.name +
            ' has ' +
            (course.capacity - course.enrolled) +
            ' seats.'
        );
      } else {
        resolve(course.name + ' is full!');
      }
    }, delay);
  });
}

const slowAddStudent = async (delay, student, course) => {
  const resultA = await student.isEnrolledSlow(delay);
  if (!resultA) {
    console.log('Course is null');
  }
  const resultB = await course.checkSpaceSlow(delay);
  const resultC = await student.notify(
    'You have been enrolled in ' + course.name
  );
  console.log(resultC);
  const resultD = await slowIncrement(delay, course);
  console.log(resultD);
};

slowAddStudent(1000, students[0], courses[1]);
