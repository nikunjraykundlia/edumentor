'use client';

interface AvatarProps {
    name: string;
    src?: string;
    size?: number;
    showOnline?: boolean;
}

export default function Avatar({ name, src, size = 40, showOnline }: AvatarProps) {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div style={{ position: 'relative', display: 'inline-flex' }}>
            {src ? (
                <img
                    src={src}
                    alt={name}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--glass-border)',
                    }}
                />
            ) : (
                <div
                    style={{
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: size * 0.35,
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        color: 'white',
                    }}
                >
                    {initials}
                </div>
            )}
            {showOnline && (
                <span
                    style={{
                        position: 'absolute',
                        bottom: 1,
                        right: 1,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: 'var(--success)',
                        border: '2px solid var(--bg-primary)',
                    }}
                />
            )}
        </div>
    );
}
