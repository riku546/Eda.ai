import PageContainer from "@/components/common/PageContainer";

const Chat = ({
  messages,
  onHealthCheck,
}: {
  messages: string[];
  onHealthCheck: () => void;
}) => {
  return (
    <PageContainer>
      <div>
        {messages.map((message) => (
          <div key={message}>{message}</div>
        ))}
      </div>

      <button type="button" onClick={onHealthCheck}>
        healthcheck
      </button>
    </PageContainer>
  );
};

export default Chat;
