import {useEffect, useRef, useState} from "react";
import * as React from "react";

interface Option {
    value: string
    label: string
}

interface CustomDropdownProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

function CustomDropdown({
                            options,
                            value,
                            onChange,
                            placeholder = "Select an option"
                        }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setIsOpen(true)
    }

    const handleOptionClick = (optionValue: string) => {
        onChange(optionValue)
        setSearchTerm('')
        setIsOpen(false)
    }

    return (
        <div className="w-full relative" ref={dropdownRef}>
            <input
                type="text"
                value={searchTerm || (value ? options.find(o => o.value === value)?.label : '')}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className="w-full h-10 px-3 py-2 text-black text-xs font-light border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
                ▼
            </button>
            {isOpen && (
                <ul className="ixed z-50 mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                    {filteredOptions.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                            className={`px-3 py-2 hover:bg-gray-100 text-gray-700 cursor-pointer text-xs ${
                                option.value === value ? 'bg-blue-100' : ''
                            }`}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default CustomDropdown