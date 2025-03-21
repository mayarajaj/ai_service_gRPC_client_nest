from concurrent import futures
import grpc
import ai_agent_pb2
import ai_agent_pb2_grpc

# Import your existing logic
from classifyConversation import get_completion_from_messages

class AiAgentServiceServicer(ai_agent_pb2_grpc.AiAgentServiceServicer):
    def ClassifyConversation(self, request, context):
        delimiter = "&&&&"
        conversation = request.conversation
        
        # Build your message string exactly as you did
        message = f"""
you are an Ai agent helping with Multiclassification a conversation .

the  classes is  : "order","discover menu","order status","complaint" . 

the conversation is between {delimiter} characters .

make sure the output will be a JSON format (only) without any more words . 

the conversation is between a customer and AI agent customer support . 

Process (only) the last message and ignore every messages before ,  based on it only add the category it belongs to.  

Give an analysis of why this category was chosen in the JSON format . 


"""
        messages = [{'role': 'system', 'content': f"{message}"} , 
                    {'role' : 'user' , 'content' : f"{delimiter}{conversation}{delimiter}"}]
        result = get_completion_from_messages(messages)
        return ai_agent_pb2.ClassificationResponse(result_json=result)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    ai_agent_pb2_grpc.add_AiAgentServiceServicer_to_server(AiAgentServiceServicer(), server)
    server.add_insecure_port('[::]:50051')  # Default port
    server.start()
    print("gRPC Python server started at port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
