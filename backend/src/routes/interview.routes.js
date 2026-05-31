import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import interviewController from '../controllers/interview.controller.js';
import upload from '../middlewares/file.middleware.js';

const interviewRouter = Router();

/**
 * @route POST /api/interview/
 * @description Generate new interview report
 * @access Private
 */
interviewRouter.post('/', authMiddleware.authUser, upload.single('resume'), interviewController.generateInterViewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by ID
 * @access Private
 */
interviewRouter.get('/report/:interviewId', authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET /api/interview/
 * @description Get all interview reports of logged in user
 * @access Private
 */
interviewRouter.get('/', authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description Generate resume pdf based on interview report ID
 * @access Private
 */
interviewRouter.post('/resume/pdf/:interviewReportId', authMiddleware.authUser, interviewController.generateResumePdfController);

export default interviewRouter;
