// const express=require("express")

// const bcrypt =require("bcrypt")

// let { PrismaClient } =require('@prisma/client');
// const e = require("express");
// //Instance of HTTP server
// const app=express();

// const prisma= new PrismaClient()

// app.use(express.json());

// // app.get("/",(req,res) => {
// //     //data from frontend
// //     //db logic
// //     //data to frontend
// //     res.send("Express- http server")
// // })
// // // ****************  HELLO WORLD 1 will execute based on the prioty 1st come **********
// // //APT-GET- http://localhost:3000/car --> HELLO WORLD 1

// // app.get("/car",(req,res) =>{
// //     res.send("Hello World")
// // })

// // //APT-GET- http://localhost:3000/car --> HELLO WORLD 2

// // app.get("/car",(req,res) =>{
// //     res.send("Hello World")
// // })

// //                     ***********         GET STUDENT    ***********
// app.get("/students",async (req,res)=>{
//     // 1. data from frontend


//     // 2. db logic
//     const studentData= await prisma.student.findMany() // GET ALL STUDENTS DETAILS

//     // 3. data to frontend
//     res.send(studentData)
// });

// app.get("/students/:roll_no",async (req,res)=>{
//     // 1. data from frontend
//     const data=req.params;

//     // 2. db logic
//      const singlestudata= await prisma.student.findUnique({
//         where:
//         {
//             roll_no: data.roll_no,
//         }

//      })
//  // GET STUDENT DETAILS BY ID

//     // 3. data to frontend
//     res.send(singlestudata);
// });

// //              ***********      ADD STUDENT         ***********

// app.post("/students",async (req,res)=>{
//     const data=req.body;

//     const newStu=await prisma.student.create({
//         data:{
//             roll_no :data.roll_no, 
//             name    :data.name, 
//             class   :data.class, 
//             dob     :data.dob, 
//             age     :data.age, 
//         },
//     });
//      res.send(newStu)
// });

// //              ***********     UPDATE/PUT STUDENT      ***********

// app.put("/students",async (req,res)=>{
//     const data=req.body;

//     const newStu=await prisma.student.update({
//         data:{
//             roll_no :data.roll_no, 
//             name    :data.name, 
//             class   :data.class, 
//             dob     :data.dob, 
//             age     :data.age, 
//         },
//         where:{
//             roll_no:data.roll_no
//         }
//     });
//      res.send(newStu)
// });

// //              ***********     DELETE STUDENT      ***********

// app.delete("/students",async (req,res)=>{
//     const data=req.body;

//     const delstu=await prisma.student.delete({
        
//         where:{
//             roll_no:data.roll_no
//         }
//     });
//      res.send(delstu)
// });

// // ***************  REGISTER  ***************
// app.post("/students/exist/",async (req, res)=>{
//     //1.
//     const data= req.body;
//     //2.
//     // CHECK USER ALREADY EXIST OR NOT

//     const userExist=await prisma.student.findFirst({
//         where:{
//             name: data.name
//         }
//     })
//     if(userExist){
//         //3.
//         res.status(404).json({message:"Student already Exist"});
//     }
//     else{
//         const hashpass=await bcrypt.hash(data.name,10)//PASSWORD\

//         const newstu=await prisma.student.create({
//             data: {
//                 roll_no : data.roll_no, 
//                 name    : data.name, 
//                 class   : data.class, 
//                 dob     : data.dob, 
//                 age     : data.age, 
//                 password: hashpass,  // Save password here
//               },
//         })
//         res.status(200).json({message:"Student added successfully",data:newstu}); 
//     }
// });

// // ************** LOGIN ************(for security use POST mthd)

// app.post("/students/login/",async (req, res)=>{
//     //1.
//     const data= req.body;//email, password[here name]
//     //2.
//     // CHECK USER ALREADY EXIST OR NOT

//     const userLogin=await prisma.student.findFirst({
//         where:{
//             name: data.name
//         }
//     })
//     console.log(data.name);
//     console.log(userLogin.name);
    
//     if(userLogin){
//         //3.
//         const check= await bcrypt.compare(data.name, userLogin.name);//plain pass, hashed pass
//         if(check){
//             res.status(200).json({message:"LOgin successfull!"});
//         }else{
//             res.status(404).json({message:"Invalid Password !"});
//         }
//     }
//     else{
//         res.status(404).json({message:"Student not Found"});
//     }
// });


// // API: REFRESH TOKEN
// app.listen(3000)


const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require('@prisma/client');
//import { z } from "zod";
let { z } =require("zod");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// *** VALIDATION ***
const student_param= z.object({
    roll_no: z.string().min(1, "Roll number is required"),
})
const student_z = z.object({
    roll_no: z.string().min(1, "Roll number is required"),
    name: z.string().min(3, "Name must be at least 3 characters").max(20),
    class: z.string().min(1, "Class is required"),
    dob: z.string().min(1, "DOB is required"),
    age: z.string().min(1, "Age is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const update_student_z = z.object({
    roll_no: z.string().min(1),
    name: z.string().min(3).max(20),
    class: z.string().min(1),
    dob: z.string().min(1),
    age: z.string().min(1),
    password: z.string().min(6),
});

const delete_student_z = z.object({
    roll_no: z.string().min(1),
});

const login_z = z.object({
    name: z.string().min(3),
    password: z.string().min(6),
});


// *********** GET ALL STUDENTS ***********
app.get("/students", async (req, res) => {
    try{
    const studentData = await prisma.student.findMany();
    res.send(studentData);
} catch (err) {
    res.status(500).json({ error: "Database error", detail: err.message });
}
});

// *********** GET STUDENT BY ROLL NO ***********
app.get("/students/:roll_no", async (req, res) => {
    //const data = req.params;
    try{
    const data = student_param.parse(req.params);
    const singleStuData = await prisma.student.findUnique({
        where: {
            roll_no: data.roll_no,
        }
    });
    res.send(singleStuData);
}
    catch (err) {
        res.status(500).json({ error: "Database error", detail: err.message });
    }
});

// *********** ADD STUDENT ***********
app.post("/students", async (req, res) => {
    try{
    const data = student_z.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newStu = await prisma.student.create({
        data: {
            roll_no: data.roll_no,
            name: data.name,
            class: data.class,
            dob: data.dob,
            age: data.age,
            password: hashedPassword 
        },
    });
    res.send(newStu);
}
    catch (err) {
        res.status(500).json({ error: "Database error", detail: err.message });
    }
});

// *********** UPDATE STUDENT ***********
app.put("/students", async (req, res) => {
    try{
    const data = update_student_z.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const updatedStu = await prisma.student.update({
        data: {
            name: data.name,
            class: data.class,
            dob: data.dob,
            age: data.age,
            password: hashedPassword
        },
        where: {
            roll_no: data.roll_no
        }
    });
    res.send(updatedStu);
}
catch (err) {
    res.status(400).json({ error: "Validation or Database error", detail: err.message });
}
});

// *********** DELETE STUDENT ***********
app.delete("/students", async (req, res) => {
    try{
    const data = delete_student_z.parse(req.body);
    const deletedStu = await prisma.student.delete({
        where: {
            roll_no: data.roll_no
        }
    });
    res.send(deletedStu);
}
catch (err) {
    res.status(400).json({ error: "Validation or Database error", detail: err.message });
}
});

// *********** REGISTER ***********
app.post("/students/exist", async (req, res) => {
    try{
    const data = student_z.parse(req.body);

    const userExist = await prisma.student.findFirst({
        where: {
            name: data.name
        }
    });

    if (userExist) {
        res.status(404).json({ message: "Student already exists" });
    } else {
        const hashpass = await bcrypt.hash(data.password, 10);
        const newStu = await prisma.student.create({
            data: {
                roll_no: data.roll_no,
                name: data.name,
                class: data.class,
                dob: data.dob,
                age: data.age,
                password: hashpass
            },
        });
        res.status(200).json({ message: "Student registered successfully", data: newStu });
    }
}catch (err) {
    res.status(500).json({ error: "Database error", detail: err.message });
}
});

// *********** LOGIN ***********
app.post("/students/login", async (req, res) => {
    try{
    const data = login_z.parse(req.body);

    const userLogin = await prisma.student.findFirst({
        where: {
            name: data.name
        }
    });

    if (userLogin) {
        const check = await bcrypt.compare(data.password, userLogin.password);
        if (check) {
            res.status(200).json({ message: "Login successful!" });
        } else {
            res.status(404).json({ message: "Invalid password!" });
        }
    } else {
        res.status(404).json({ message: "Student not found" });
    }
}
catch (err) {
    res.status(500).json({ error: "Database error", detail: err.message });
}
});

// *********** LISTEN ***********
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
