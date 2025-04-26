export type MeetUpPostBody = {
    location: string;
    datetime: string;
    open_to: string;
    additional_details?: string;
}

export type MeetUpPostType = {
    title: string;
    url?: string;
    body: MeetUpPostBody;
}

export const defaultPostData: MeetUpPostType = {
    title: "",
    url: undefined,
    body: {
        location: "Unknown",
        datetime: "Not Specified",
        open_to: "All",
        additional_details: undefined
    }
}