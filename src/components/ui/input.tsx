import type { InputHTMLAttributes } from "react";

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
	...props
}) => {
	return (
		<input
			type="text"
			className="bg-stone-700 py-2 px-4 rounded-lg text-white placeholder:text-stone-200 outline-none"
			{...props}
		/>
	);
};
