import { CV } from '../database/models/curriculums_schema';

export async function sendToCreateCVPDF(params: Partial<CV>) {
   const { cv_id, language_set } = params;
   global.service.sendTo('/virtual-browser/cv-create-pdf', { cv_id, language_set });
}

export async function sendToDeleteCVPDF(cv_id: number, language_set: string, userFullName: string) {
   global.service.sendTo('/virtual-browser/cv-delete-pdf', { cv_id, language_set, userFullName });
}
