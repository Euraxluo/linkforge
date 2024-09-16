import * as React from 'react'
import {useState, useRef, useEffect, useCallback} from 'react'
import {createPortal} from 'react-dom'
import {LucideActivity, LucideArrowDown} from "lucide-react";

interface CustomInputProps {
    value: string
    onChange: (value: string) => void
    isValid: boolean
    placeholder?: string
}

export function CustomInput({value, onChange, isValid, placeholder = "Input Content"}: CustomInputProps) {
    const [showTooltip, setShowTooltip] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [tooltipPosition, setTooltipPosition] = useState({top: 0, left: 0})

    const handleIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    useEffect(() => {
        if (showTooltip && inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect()
            setTooltipPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 200, // Adjust this value as needed
            })
        }
    }, [showTooltip])

    return (
        <div className="w-full max-w-md mx-auto space-y-2">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleIdInputChange}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 pr-8 text-black text-sm border rounded-md focus:outline-none focus:ring-2 ${
                        isValid ? 'border-gray-300 focus:ring-blue-500' : 'border-red-500 focus:ring-red-500'
                    }`}
                    aria-invalid={!isValid}
                    aria-describedby="customIdHelp"
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onFocus={() => setShowTooltip(true)}
                    onBlur={() => setShowTooltip(false)}
                    aria-label="Show allowed characters"
                >
                    i
                </button>
                {showTooltip && createPortal(
                    <div
                        className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg top-full mt-1"
                        style={{top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px`}}
                    >
                        Allowed characters: A-Z, a-z, 0-9, and -
                    </div>,
                    document.body
                )}
            </div>
            {!isValid && (
                <p id="customIdHelp" className="text-xs text-red-500">
                    Only letters, numbers, and hyphens are allowed.
                </p>
            )}
        </div>
    )
}


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

export function CustomDropdown({
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