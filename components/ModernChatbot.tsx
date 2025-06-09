'use client'

import { userSelector } from '@/redux/slices/userSlice'
import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

const ModernChatbot = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const textareaRef = useRef(null)

    const userInfo = useSelector(userSelector).userInfo

    const OPENROUTER_API_KEY = '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'

    const createSystemPrompt = () => {
        return `Bạn là trợ lý AI chuyên nghiệp của cửa hàng thiết bị tự động hóa ShopFinity. 

NHIỆM VỤ CHÍNH:
- Tư vấn các sản phẩm thiết bị tự động hóa: PLC, HMI, cảm biến, biến tần, relay, contactor, timer, counter,...
- Hỗ trợ khách hàng lựa chọn sản phẩm phù hợp với nhu cầu
- Cung cấp thông tin kỹ thuật cơ bản và ứng dụng thực tế
- Báo giá và thông tin giao hàng

QUY TẮC PHẢN HỒI:
- Chỉ tư vấn về thiết bị tự động hóa và điều khiển công nghiệp
- Trả lời ngắn gọn, đúng trọng tâm (tối đa 3-4 câu)
- Nếu hỏi ngoài chuyên môn: "Xin lỗi, tôi chỉ hỗ trợ tư vấn thiết bị tự động hóa. Bạn có cần tư vấn sản phẩm nào không?"
- Luôn hỏi ngược để hiểu rõ nhu cầu cụ thể
- Kết thúc bằng gợi ý liên hệ nếu cần hỗ trợ thêm

PHONG CÁCH: Chuyên nghiệp, thân thiện, tập trung vào giải pháp kỹ thuật.`
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: Date.now(),
                    content:
                        'Xin chào! Tôi là SmartBot - trợ lý AI của ShopFinity 🤖\n\nChúng tôi chuyên cung cấp thiết bị tự động hóa công nghiệp: PLC, HMI, Cảm biến, Biến tần...\n\nBạn cần tư vấn sản phẩm gì hôm nay? ⚡',
                    isUser: false,
                    timestamp: new Date()
                }
            ])
        }
        if (isOpen) {
            scrollToBottom()
        }
    }, [isOpen])

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            const scrollHeight = textareaRef.current.scrollHeight
            const maxHeight = 120

            if (scrollHeight > maxHeight) {
                textareaRef.current.style.height = maxHeight + 'px'
                textareaRef.current.style.overflowY = 'auto'
            } else {
                textareaRef.current.style.height = scrollHeight + 'px'
                textareaRef.current.style.overflowY = 'hidden'
            }
        }
    }

    useEffect(() => {
        adjustTextareaHeight()
    }, [inputValue])

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        const userMessage = {
            id: Date.now(),
            content: inputValue.trim(),
            isUser: true,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsLoading(true)

        try {
            const contextMessages = messages.slice(-6).map(msg => ({
                role: msg.isUser ? 'user' : 'assistant',
                content: msg.content
            }))

            const messagesToSend = [
                { role: 'system', content: createSystemPrompt() },
                ...contextMessages,
                { role: 'user', content: userMessage.content }
            ]

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'http://www.smarttech-store.com',
                    'X-Title': 'SmartTech Store',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'meta-llama/llama-3.3-8b-instruct:free',
                    messages: messagesToSend,
                    temperature: 0.7,
                    max_tokens: 500
                })
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            const botResponse = data.choices?.[0]?.message?.content

            if (botResponse) {
                const assistantMessage = {
                    id: Date.now() + 1,
                    content: botResponse,
                    isUser: false,
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, assistantMessage])
            } else {
                throw new Error('Không nhận được phản hồi hợp lệ')
            }
        } catch (error) {
            console.error('Error:', error)
            const errorMessage = {
                id: Date.now() + 1,
                content:
                    'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau hoặc liên hệ:\n📞 Hotline: 0833.367.548\n📧 Email: support@smarttech.vn',
                isUser: false,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const formatTime = date => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (!isOpen) return null

    return (
        <div className='fixed bottom-4 right-4 z-50 font-sans'>
            <div className='w-96 bg-white/95 overflow-hidden backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-500 animate-slideIn'>
                <div className='relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-4 rounded-t-2xl overflow-hidden'>
                    <div className='absolute inset-0 bg-white/10 backdrop-blur-sm'>
                        <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent'></div>
                        <div className='absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 animate-pulse-slow'></div>
                        <div className='absolute bottom-0 right-2 w-24 h-24 bg-white/5 rounded-full translate-x-12 translate-y-12 animate-float'></div>
                        <div className='absolute top-1/2 left-1/2 w-20 h-20 bg-white/5 rounded-full -translate-x-10 -translate-y-10 animate-drift'></div>
                    </div>

                    <div className='relative flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                            {/* Avatar with Glow Effect */}
                            <div className='relative'>
                                <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/30'>
                                    <div className='w-8 h-8 bg-gradient-to-br from-white to-blue-100 rounded-lg flex items-center justify-center'>
                                        <svg
                                            className='w-5 h-5 text-blue-600'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2.5}
                                                d='M13 10V3L4 14h7v7l9-11h-7z'
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Bot Info */}
                            <div>
                                <h3 className='text-white font-semibold text-lg leading-tight'>ShopFinity AI</h3>
                                <div className='flex items-center space-x-2 mt-0.5'>
                                    <div className='w-2 mt-[2px] h-2 bg-green-500 rounded-full animate-pulse'></div>
                                    <span className='text-green-400 text-sm font-medium'>Trực tuyến</span>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className='w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm group'
                        >
                            <svg
                                className='w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className='h-[400px] overflow-y-auto p-4 pb-0 space-y-2 bg-gradient-to-b from-slate-50/50 to-white scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent'>
                    {messages.map(message => (
                        <div
                            key={message.id}
                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}
                        >
                            <div
                                className={`flex items-start space-x-2.5 max-w-[85%] ${
                                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                                }`}
                            >
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                                        message.isUser ? '' : 'bg-gradient-to-br from-slate-100 to-slate-200'
                                    }`}
                                >
                                    {message.isUser ? (
                                        <img
                                            className='w-9 h-9 object-cover rounded-full'
                                            src={userInfo?.avatar || '/images/account.png'}
                                        />
                                    ) : (
                                        <svg
                                            className='w-4 h-4 text-blue-600'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M13 10V3L4 14h7v7l9-11h-7z'
                                            />
                                        </svg>
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div className='flex flex-col space-y-1'>
                                    <div
                                        className={`relative px-4 py-2.5 rounded-2xl shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:shadow-md ${
                                            message.isUser
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md'
                                                : 'bg-white/80 text-slate-700 border border-slate-200/60 rounded-bl-md'
                                        }`}
                                    >
                                        <div className='relative text-sm leading-relaxed whitespace-pre-wrap font-medium'>
                                            {message.content}
                                        </div>
                                    </div>

                                    {/* Timestamp */}
                                    <div
                                        className={`text-xs text-slate-400 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                            message.isUser ? 'text-right' : 'text-left'
                                        }`}
                                    >
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className='pb-[19px] flex justify-start animate-fadeInUp'>
                            <div className='flex items-start space-x-2.5 max-w-[85%]'>
                                <div className='w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm'>
                                    <svg
                                        className='w-4 h-4 text-blue-600'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M13 10V3L4 14h7v7l9-11h-7z'
                                        />
                                    </svg>
                                </div>
                                <div className='bg-white/80 border border-slate-200/60 rounded-xl rounded-bl-md px-4 py-3 shadow-sm backdrop-blur-sm'>
                                    <div className='flex space-x-1 mt-[2px]'>
                                        <div className='w-[7px] h-[7px] bg-blue-500 rounded-full animate-bounce'></div>
                                        <div
                                            className='w-[7px] h-[7px] bg-blue-500 rounded-full animate-bounce'
                                            style={{ animationDelay: '0.1s' }}
                                        ></div>
                                        <div
                                            className='w-[7px] h-[7px] bg-blue-500 rounded-full animate-bounce'
                                            style={{ animationDelay: '0.2s' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className='p-4 bg-white/50 backdrop-blur-sm border-t border-slate-200/60'>
                    <div className='flex items-end space-x-4'>
                        {/* Input Field */}
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder='Hỏi về PLC, HMI, cảm biến...'
                            className='flex-1 min-h-[46px] max-h-[120px] px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-lg resize-none outline-none focus:border-blue-600/80 focus:bg-white/90 transition-all duration-200 text-sm placeholder-slate-400 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent'
                            disabled={isLoading}
                            rows={1}
                        />

                        {/* Send Button */}
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            className='w-[46px] h-[46px] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform disabled:transform-none disabled:shadow-none'
                        >
                            {isLoading ? (
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            ) : (
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100%) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }

                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px) translateX(16px);
                    }
                    50% {
                        transform: translateY(-10px) translateX(20px);
                    }
                }

                @keyframes drift {
                    0%,
                    100% {
                        transform: translate(-10px, -10px);
                    }
                    50% {
                        transform: translate(-5px, -15px);
                    }
                }

                @keyframes pulse-slow {
                    0%,
                    100% {
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.1;
                    }
                }

                @keyframes pulse-gentle {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.4s ease-out forwards;
                }

                .animate-slideIn {
                    animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                .animate-drift {
                    animation: drift 6s ease-in-out infinite;
                }

                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }

                .animate-pulse-gentle {
                    animation: pulse-gentle 2s ease-in-out infinite;
                }

                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }

                .scrollbar-thumb-blue-500::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #60a5fa, #60a5fa); /* blue-500 to blue-600 */
                    border-radius: 3px;
                }

                .scrollbar-track-transparent::-webkit-scrollbar-track {
                    background: transparent;
                }

                .scrollbar-thumb-blue-500::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #60a5fa, #3b82f6); /* darker on hover */
                }
            `}</style>
        </div>
    )
}

export default ModernChatbot
