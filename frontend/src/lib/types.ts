<<<<<<< HEAD
// ── Entity Types ──

export interface University {
    _id: string;
    name: string;
    domain?: string;
    logo?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher';
    universityId: string | University;
    avatar?: string;
    enrolledSubjects?: Subject[];
    createdSubjects?: Subject[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Subject {
    _id: string;
    name: string;
    code: string;
    description?: string;
    teacher: Pick<User, '_id' | 'name' | 'email' | 'avatar'>;
    universityId: string;
    enrolledStudents: string[];
    coverColor: string;
    notesCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Note {
    _id: string;
    title: string;
    subject: string;
    uploadedBy: Pick<User, '_id' | 'name' | 'email'>;
    fileUrl: string;
    fileId?: string;
    fileName: string;
    fileType: string;
    fileSizeKb: number;
    thumbnailUrl?: string;
    pineconeStatus: 'pending' | 'indexed' | 'failed';
    n8nSessionId: string;
    indexedAt?: string;
    createdAt: string;
}

export interface ChatSession {
    _id: string;
    student: string;
    subject: Subject | string;
    sessionId: string;
    title: string;
    messageCount: number;
    lastMessageAt?: string;
    createdAt: string;
}

export interface Citation {
    evidence: string;
}

export interface StructuredAnswer {
    answerfromnotes: string;
    confidence: 'High' | 'Medium' | 'Low';
    citation: Citation;
}

export interface MCQ {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

export interface Document {
    title: string;
    content: string;
    type: string;
    url?: string;
}

export interface StructuredResponse {
    answer?: StructuredAnswer[];
    mcqs?: MCQ[];
    document?: Document;
    metadata: {
        notesChunksUsed: string;
        generatedAt: string;
    };
}

export interface ChatMessage {
    _id: string;
    session: string;
    role: 'user' | 'assistant';
    content: string;
    structuredResponse?: StructuredResponse;
    createdAt: string;
}

// ── API Response Types ──

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    code?: string;
    [key: string]: unknown;
}

export interface AuthResponse extends ApiResponse {
    user: User;
    accessToken: string;
=======
export interface User {
    id: string;
    name: string;
    email: string;
    avatar_initials: string;
}

export interface FileData {
    id: string;
    name: string;
    size: string;
    pages: number;
    uploaded_at: string;
}

export interface Subject {
    id: string;
    name: string;
    short_name: string;
    color: string;
    files: FileData[];
    created_at: string;
}

export interface Citation {
    file: string;
    page: number;
    chunk_id: string;
}


export interface MCQOption {
    label: string;
    text: string;
}

export interface MCQ {
    id: string;
    question: string;
    options: MCQOption[];
    correct: string;
    explanation: string;
    citation: Citation;
    evidence: string;
    user_answer?: string | null;
    confidence: "High" | "Medium" | "Low";
}

export interface ShortAnswer {
    id: string;
    question: string;
    model_answer: string;
    citation: Citation;
    evidence: string;
    user_answer?: string | null;
    confidence: "High" | "Medium" | "Low";
>>>>>>> 40c3b1e1262813eee8f664573faff647d1422ef3
}
