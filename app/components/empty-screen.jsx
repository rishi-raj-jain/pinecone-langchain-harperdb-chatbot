const exampleMessages = ['What is LaunchFa.st?', 'What all framework templates does LaunchFa.st marketplace have?']

export function EmptyScreen({ handleFormSubmission }) {
  return (
    <div className="mt-8 w-full px-4">
      <div className="rounded-lg border bg-background p-8 shadow">
        <h1 className="mb-2 text-lg text-gray-600">
          Welcome to a Real-Time AI Chatbot serving cached responses and rate limiting users with{' '}
          <a className="text-black underline" target="_blank" href="https://harperdb.io">
            HarperDB
          </a>{' '}
          for speed and reliability!
        </h1>
        <p className="leading-normal text-muted-foreground">You can start a conversation here or try the following examples:</p>
        <div className="mt-4 flex flex-col space-y-2">
          {exampleMessages.map((message, index) => (
            <div
              key={index}
              variant="link"
              className="text-base cursor-pointer"
              onClick={() => {
                document.getElementById('message').value = message
                handleFormSubmission()
              }}
            >
              <span className="text-black/50">&rarr;&nbsp;&nbsp;</span>
              <span className="hover:underline">{message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
