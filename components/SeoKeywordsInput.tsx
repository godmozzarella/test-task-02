import React, { useState, KeyboardEvent } from "react";

function SeoKeywordsInput({ value, onChange }: { value: string[], onChange: (v: string[]) => void }) {
	const [inputValue, setInputValue] = useState("");

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && inputValue.trim() !== "") {
			e.preventDefault();
				if (!value.includes(inputValue.trim())) {
					onChange([...value, inputValue.trim()]);
				}
				setInputValue("");
			}
		};

		const removeKeyword = (keyword: string) => {
			onChange(value.filter(k => k !== keyword));
		};

		return (
			<div className="flex flex-wrap gap-1 border rounded p-2">
				{value.map((k) => (
					<div key={k} className="bg-gray-100 text-gray-800 px-2 py-1 rounded flex items-center gap-1">
						{k} <button type="button" onClick={() => removeKeyword(k)}>×</button>
					</div>
				))}
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					className="flex-1 outline-none"
				/>
			</div>
		);
}

export default SeoKeywordsInput
