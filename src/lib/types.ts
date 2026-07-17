export type FeedbackKind = 'praise' | 'issue' | 'idea';
export type FeedbackStatus = 'new' | 'reviewed' | 'done';
export type FeedbackSource = 'slack' | 'email' | 'meeting' | 'call' | 'support' | 'other';
export type FeedbackPriority = 'low' | 'medium' | 'high';

export interface Feedback {
  id: string;
  text: string;
  kind: FeedbackKind;
  status: FeedbackStatus;
  source: FeedbackSource;
  priority: FeedbackPriority | null;
  tags: string[];
  contactId: string | null;
  featureId: string | null;
  createdAt: number;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  hue: number; // accent hue for the avatar — color lives on objects, not chrome
  avatar: string; // key into AVATARS (3d cartoon portrait)
  createdAt: number;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  hue: number;
  createdAt: number;
}

export interface BlunData {
  feedback: Feedback[];
  contacts: Contact[];
  features: Feature[];
}
