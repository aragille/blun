import { useSyncExternalStore } from 'react';
import type {
  BlunData,
  Contact,
  Feature,
  Feedback,
  FeedbackKind,
  FeedbackPriority,
  FeedbackSource,
  FeedbackStatus,
} from './types';
import { seedData } from './seed';
import { avatarForId, isAvatarKey, randomAvatar } from './avatars';

const STORAGE_KEY = 'blun-data-v1';

let data: BlunData = load();
const listeners = new Set<() => void>();

/** Fill in fields added after a user's data was first written. */
function migrate(raw: BlunData): BlunData {
  return {
    contacts: raw.contacts.map((c) => ({
      ...c,
      avatar: isAvatarKey(c.avatar) ? c.avatar : avatarForId(c.id),
    })),
    features: raw.features,
    feedback: raw.feedback.map((f) => ({
      ...f,
      source: f.source ?? 'other',
      priority: f.priority ?? null,
      tags: f.tags ?? [],
    })),
  };
}

function load(): BlunData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return migrate(JSON.parse(raw) as BlunData);
  } catch {
    // corrupted storage — fall through to seed
  }
  const seeded = seedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function commit(next: BlunData) {
  data = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBlunData(): BlunData {
  return useSyncExternalStore(subscribe, () => data);
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function addFeedback(input: {
  text: string;
  kind?: FeedbackKind;
  source?: FeedbackSource;
  priority?: FeedbackPriority | null;
  tags?: string[];
  contactId?: string | null;
  featureId?: string | null;
}): Feedback {
  const fb: Feedback = {
    id: uid(),
    text: input.text.trim(),
    kind: input.kind ?? 'idea',
    status: 'new',
    source: input.source ?? 'other',
    priority: input.priority ?? null,
    tags: input.tags ?? [],
    contactId: input.contactId ?? null,
    featureId: input.featureId ?? null,
    createdAt: Date.now(),
  };
  commit({ ...data, feedback: [fb, ...data.feedback] });
  return fb;
}

export function updateFeedback(id: string, patch: Partial<Omit<Feedback, 'id'>>) {
  commit({
    ...data,
    feedback: data.feedback.map((f) => (f.id === id ? { ...f, ...patch } : f)),
  });
}

export function deleteFeedback(id: string) {
  commit({ ...data, feedback: data.feedback.filter((f) => f.id !== id) });
}

export function cycleStatus(id: string) {
  const order: FeedbackStatus[] = ['new', 'reviewed', 'done'];
  const f = data.feedback.find((f) => f.id === id);
  if (!f) return;
  const next = order[(order.indexOf(f.status) + 1) % order.length];
  updateFeedback(id, { status: next });
}

export function addContact(input: { name: string; role: string; avatar?: string }): Contact {
  const c: Contact = {
    id: uid(),
    name: input.name.trim(),
    role: input.role.trim(),
    hue: Math.floor(Math.random() * 360),
    avatar: input.avatar ?? randomAvatar(),
    createdAt: Date.now(),
  };
  commit({ ...data, contacts: [...data.contacts, c] });
  return c;
}

export function updateContact(id: string, patch: Partial<Omit<Contact, 'id'>>) {
  commit({
    ...data,
    contacts: data.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
  });
}

export function deleteContact(id: string) {
  commit({
    ...data,
    contacts: data.contacts.filter((c) => c.id !== id),
    feedback: data.feedback.map((f) => (f.contactId === id ? { ...f, contactId: null } : f)),
  });
}

export function addFeature(input: { name: string; description: string }): Feature {
  const f: Feature = {
    id: uid(),
    name: input.name.trim(),
    description: input.description.trim(),
    hue: Math.floor(Math.random() * 360),
    createdAt: Date.now(),
  };
  commit({ ...data, features: [...data.features, f] });
  return f;
}

export function updateFeature(id: string, patch: Partial<Omit<Feature, 'id'>>) {
  commit({
    ...data,
    features: data.features.map((f) => (f.id === id ? { ...f, ...patch } : f)),
  });
}

export function deleteFeature(id: string) {
  commit({
    ...data,
    features: data.features.filter((f) => f.id !== id),
    feedback: data.feedback.map((fb) => (fb.featureId === id ? { ...fb, featureId: null } : fb)),
  });
}

export function resetToSeed() {
  commit(seedData());
}
