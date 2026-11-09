export interface PrivacySection { title: string; paragraphs: readonly string[]; items?: readonly string[]; }
export interface PrivacyPageModel { updatedAt: string; sections: readonly PrivacySection[]; }
