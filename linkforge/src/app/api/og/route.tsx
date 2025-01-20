import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url)

    // ?title=<title>
    const hasTitle = searchParams.has('title')
    const title = hasTitle
        ? searchParams.get('title')?.slice(0, 100)
        : 'My default title'
    console.log(title)

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                }}
            >

                <div
                    style={{
                        fontSize: 40,
                        color: 'black',
                        background: 'white',
                        width: '100%',
                        height: '100%',
                        padding: '50px 200px',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                    }}
                >
                    👋 Hello {title} 你好吗 नमस्ते こんにちは สวัสดีค่ะ 안녕 добрий день Hallá
                </div>
                <div
                    style={{
                        fontSize: 100,
                        color: 'black',
                        background: 'white',
                        width: '100%',
                        height: '100%',
                        padding: '50px 200px',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                    }}
                >
                    👋, 🌎
                </div>
                <svg fill="#000000" viewBox="0 0 284 65">
                    <path d="M141.68 16.25c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm117.14-14.5c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm-39.03 3.5c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9v-46h9zM37.59.25l36.95 64H.64l36.95-64zm92.38 5l-27.71 48-27.71-48h10.39l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10v14.8h-9v-34h9v9.2c0-5.08 5.91-9.2 13.2-9.2z" />
                </svg>
                <div tw="bg-gray-50 flex">
                    <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
                        <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
                            <span tw="text-xl mb-8">Ready to dive in?</span>
                            <span tw="text-indigo-600">Start your free trial today.</span>
                        </h2>
                        <div tw="mt-8 flex md:mt-0">
                            <div tw="flex rounded-md shadow">
                                <a
                                    href="#"
                                    tw="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white"
                                >
                                    Get started
                                </a>
                            </div>
                            <div tw="ml-3 flex rounded-md shadow">
                                <a
                                    href="#"
                                    tw="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600"
                                >
                                    Learn more
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            emoji: 'twemoji',
        }
    )
}