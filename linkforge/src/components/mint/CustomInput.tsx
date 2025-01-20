import * as React from 'react'
import {useState, useRef, useEffect} from 'react'
import {createPortal} from 'react-dom'

interface CustomInputProps {
    value: string
    onChange: (value: string) => void
    isValid: boolean
    placeholder?: string
}

function CustomInput({value, onChange, isValid, placeholder = "Input Content"}: CustomInputProps) {
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

export default CustomInput;