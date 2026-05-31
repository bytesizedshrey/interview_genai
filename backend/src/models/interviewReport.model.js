import mongoose, { mongo } from "mongoose";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * -user provides :> 
 * JD
 * Resume text
 * self description
 * 
 * -matchScore : num
 * 
 * -ai response :> 
 * tech-ques : array of objects
 * behav-ques : array of objects
 * skillGap : array of objects
 * prepPlans : array of objects
 */

const technicalQuesSchema = new mongoose.Schema({
    question : {
        type : 'String',
        required : [true,"Technical question is required."]
    },
    intention : {
        type : String,
        required : [true, "Intention is required."]
    },
    answer : {
        type : String,
        required : [true, "Answer is required."]
    }
},{
    _id : false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question : {
        type : 'String',
        required : [true,"Technical question is required."]
    },
    intention : {
        type : String,
        required : [true, "Intention is required."]
    },
    answer : {
        type : String,
        required : [true, "Answer is required."]
    }
},{
    _id : false
})

const skillGapSchema = new mongoose.Schema({
    skill : {
        type : String,
        required : [true,"skills are required"]
    },
    severity : {
        type : String,
        enum : ['low','medium','high'],
        required : [true,'severity is required']
    }
},{
    _id:false
}) 

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required : [true,'day is required']
    },
    focus : {
        type : String,
        required : [true,'focus is required']
    },
    tasks : [{
        type : String,
        required : [true, "task is required"]
    }]
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription : {
         type : String,
         required : [true, "Job description is required."]
    },
    resume : {
        type : String
    },
    selfDescription:{
        type : String
    },
    matchScore : {
        type : Number,
        min : 0,
        max : 100
    },
    technicalQuestions : [technicalQuesSchema],
    behavioralQuestions : [behavioralQuestionSchema],
    skillGaps : [skillGapSchema],
    preparationPlan : [preparationPlanSchema]
},{
    timestamps : true
})

const interviewReportModel = mongoose.model("InterviewReport",interviewReportSchema)

export default interviewReportModel