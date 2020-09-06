
const mongodb = require('mongoose');
mongodb.connect("mongodb://localhost:27017/coursesdb", {useNewUrlParses: true}, (error) => {
	if(error) console.log(error);
	console.log("DB connection - Success");
});

const Joi = require('joi');
// validate input request data like email valiation and max and min no. of
// characters

const express = require('express');
const app = express();

app.use(express.json());

const courses = [
	{id: 1, name: "course1"},
	{id: 2, name: "course2"},
	{id: 3, name: "course3"}
];

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
	res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if(!course) res.status(404).send("There is no course available in this id");
	res.send(course);
});

app.post('/api/courses', (req, res) => {
	
	// const result = validateCourse(req.body);
	
	const {error} = validateCourse(req.body); // result.error
	
	if(error){
		res.status(400).send(error);
		return;
	}
	
	const newCourse = {
			id: courses.length + 1,
			name: req.body.name
	};
	courses.push(newCourse);
	res.send(newCourse);
});


app.put('/api/courses/:id', (req, res) => {
	
	const existingCourse = courses.find(c => c.id === parseInt(req.params.id));
	if(!existingCourse) res.status(404).send("There is no course available in this id");
	
	const {error} = validateCourse(req.body); // result.error
	if(error){
		res.status(400).send(error);
		return;
	}
	
	existingCourse.name = req.body.name;
	res.send(existingCourse);
	
});

function validateCourse(course){
	
	// we are defining the name value is mandatory and the minimum character is
	// 3
	const nameschema = {
		name : Joi.string().min(3).required
	};
	
	const result = Joi.validate(course, nameSchema);
	console.log(result);
	
	return result;
}

// this port can be set in windows machine by set PORT = 4000 in command prompt
const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`Listening port ${port}...`));