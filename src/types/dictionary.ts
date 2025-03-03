// src/types/dictionary.ts

export interface Dictionary {
  navbar: {
    home: string;
    about: string;
    contact: string;
    faq: string;
    gallery: string;
    services: string;
  };
  pages: {
    home: {
      title: string;
      description: string;
      missionTitle: string;
      mission: string;
      contactTitle: string;
      contactInfo: string;
    };
    contact: {
      title: string;
      email: string;
      phone: string;
      address: string;
      form: {
        name: string;
        email: string;
        message: string;
        submit: string;
      };
      socialHeading: string;
      mapsHeading: string;
    };
    about: {
      title: string;
      mission: string;
      services?: string;
      services_list?: string[];
      team: string;
      team_info: string;
    };
    faq: {
      title: string;
      questions: {
        question: string;
        answer: string;
      }[];
    };
    gallery: {
      title: string;
      casePrefix: string;
      cases: {
        id: number;
        title: string;
        photos: {
          description: string;
        }[];
      }[];
    };
    services: {
      title: string;
      services_list: string[];
      descriptions?: string[]; // Service descriptions
    }
  };
}