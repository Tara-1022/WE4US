export enum JobType {
    Internship = "Internship",
    Job = "Job",
    Research = "Research Program",
    Other = "Other"
}

export type JobPostData = {
    url?: string,
    name: string,
    body: JobPostBody
}

export type JobPostBody = {
    company: string,
    role: string,
    location: string,
    open: boolean,
    deadline?: string,
    job_type: JobType; 
    description: string
}