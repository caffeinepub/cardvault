import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface SavedContent {
    id: string;
    content: string;
    contentType: ContentType;
    linkTitle: string;
}
export interface Reminder {
    id: string;
    content: string;
    createdAt: Time;
    completed: boolean;
    dueDate?: Time;
}
export interface Idea {
    id: string;
    content: string;
    createdAt: Time;
}
export interface BusinessCard {
    bio: string;
    title: string;
    fullName: string;
    email: string;
    website: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum ContentType {
    bookmark = "bookmark",
    general = "general"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createIdea(id: string, content: string): Promise<void>;
    createReminder(reminder: Reminder): Promise<void>;
    createSavedContent(content: SavedContent): Promise<void>;
    deleteIdea(id: string): Promise<void>;
    deleteReminder(id: string): Promise<void>;
    deleteSavedContent(id: string): Promise<void>;
    getBusinessCard(): Promise<BusinessCard | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUpcomingReminders(): Promise<Array<Reminder>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listIdeas(): Promise<Array<Idea>>;
    listSavedContent(): Promise<Array<SavedContent>>;
    readIdea(id: string): Promise<Idea | null>;
    readReminder(id: string): Promise<Reminder | null>;
    readSavedContent(id: string): Promise<SavedContent | null>;
    saveBusinessCard(card: BusinessCard): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateIdea(id: string, newContent: string): Promise<void>;
    updateReminder(id: string, updatedReminder: Reminder): Promise<void>;
    updateSavedContent(id: string, content: SavedContent): Promise<void>;
}
