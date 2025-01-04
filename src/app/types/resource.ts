export type ResourceType = "document" | "course" | "video" | "audio";

export type Module = {
  title: string;
  chapters: string[];
};

export type DocumentDetails = {
  fileFormat: string;
  pageCount: number;
};

export type VideoDetails = {
  duration: number;
  resolution: string;
};

export type AudioDetails = {
  duration: number;
  fileFormat: string;
};

export type ResourceFormData = {
  title: string;
  description: string;
  createdBy: string;
  type: ResourceType;
  modules: Module[];
  documentDetails?: DocumentDetails;
  videoDetails?: VideoDetails;
  platform?: string;
  audioDetails?: AudioDetails;
  benefits: string[];
  price: number;
  contactEmail: string;
  attachments?: {
    name: string;
    type: string;
    size?: number;
  }[];
};

