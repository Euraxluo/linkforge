import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle } from 'lucide-react'

interface TransactionVisualizerProps {
    isSigningTransaction: boolean
    transactionHash: string | null
    onClose: () => void
}

export const TransactionVisualizer: React.FC<TransactionVisualizerProps> = ({
                                                                                isSigningTransaction,
                                                                                transactionHash,
                                                                                onClose
                                                                            }) => {
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        if (isSigningTransaction || transactionHash) {
            setShowContent(true)
        }
    }, [isSigningTransaction, transactionHash])

    const handleClose = () => {
        setShowContent(false)
        setTimeout(onClose, 300) // Delay to allow exit animation
    }

    return (
        <AnimatePresence>
            {showContent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>

                        {isSigningTransaction ? (
                            <div className="text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
                                />
                                <p className="mt-4 text-lg font-semibold">Signing transaction...</p>
                                <p className="mt-2 text-sm text-gray-500">Please wait while we process your request.</p>
                            </div>
                        ) : transactionHash ? (
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                >
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                                </motion.div>
                                <h3 className="mt-4 text-lg font-semibold text-green-600">Transaction Successful!</h3>
                                <p className="mt-2 text-sm text-gray-600">Your transaction has been processed successfully.</p>
                                <a
                                    href={`https://suiscan.xyz/testnet/tx/${transactionHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    View Transaction Details
                                </a>
                            </div>
                        ) : null}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}