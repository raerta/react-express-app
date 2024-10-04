export default function AiMessage({children}: {children: React.ReactNode}){
    return (
        <div
            className={`chat-bubble bot-message`}
          >
            {children}
          </div>
    )
}