'use client';

import Sidebar, { type SidebarItem } from './Sidebar';
import { LayoutDashboard, BookOpen, MessageSquare, UserCircle } from 'lucide-react';

const STUDENT_ITEMS: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/student/dashboard' },
    { icon: BookOpen, label: 'My Subjects', href: '/student/subjects' },
    { icon: MessageSquare, label: 'Chat History', href: '/student/chat' },
    { icon: UserCircle, label: 'Profile', href: '/student/profile' },
];

export default function StudentSidebar() {
    return <Sidebar items={STUDENT_ITEMS} />;
}
