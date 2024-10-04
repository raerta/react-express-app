export default function UserMessage({children}: {children: React.ReactNode}){
    return (
        <div
            className={`chat-bubble user-message`}
          >
            {children}
          </div>
    )
}