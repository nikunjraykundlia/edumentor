'use client';

import Sidebar, { type SidebarItem } from './Sidebar';
import { LayoutDashboard, BookOpen, Upload, UserCircle } from 'lucide-react';

const TEACHER_ITEMS: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/teacher/dashboard' },
    { icon: BookOpen, label: 'My Subjects', href: '/teacher/subjects' },
    { icon: Upload, label: 'Upload Notes', href: '/teacher/upload' },
    { icon: UserCircle, label: 'Profile', href: '/teacher/profile' },
];

export default function TeacherSidebar() {
    return <Sidebar items={TEACHER_ITEMS} />;
}
