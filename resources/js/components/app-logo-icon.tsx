import { SVGAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            className={className}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Moeda / Letra Q */}
            <circle
                cx="13"
                cy="12.5"
                r="8.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.75"
            />
            <circle
                cx="13"
                cy="12.5"
                r="4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                opacity="0.6"
            />
            {/* Checkmark / Seta de retorno formando a perninha do Q */}
            <path
                d="M12 17L16.5 21.5L25 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M21 13H25V17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
