const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { getCompletionFromMessages } = require('./classify');

// Load proto
const packageDefinition = protoLoader.loadSync(
  path.join('G:\\NEST_projects\\ai-service-microservice\\proto', 'ai_agent.proto'),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const aiagentProto = grpc.loadPackageDefinition(packageDefinition).aiagent;

const server = new grpc.Server();

server.addService(aiagentProto.AiAgentService.service, {
  ClassifyConversation: async (call, callback) => {
    const delimiter = "&&&&";
    const conversation = call.request.conversation;

    const message = `
you are an Ai agent helping with Multiclassification a conversation .

the classes is: "order", "discover menu", "order status", "complaint".

the conversation is between ${delimiter} characters.

make sure the output will be a JSON format (only) without any more words.

the conversation is between a customer and AI agent customer support.

Process (only) the last message and ignore every messages before, based on it only add the category it belongs to.

Give an analysis of why this category was chosen in the JSON format.
`;

    const messages = [
      { role: 'system', content: message },
      { role: 'user', content: `${delimiter}${conversation}${delimiter}` }
    ];

    try {
      const result = await getCompletionFromMessages(messages);
      callback(null, { result_json: result });
    } catch (err) {
      console.error("Error in gRPC method:", err.message);
      callback({
        code: grpc.status.INTERNAL,
        message: "Internal server error: " + err.message
      });
    }
  } , 
  EvolveConversation: async (call, callback) => {
    const delimiter1 = "&&&&";
    const delimiter2 = "###" ; 
    const conversation = call.request.conversation;
    const json = call.request.json ; 


    const message = `
You are a model for evaluating the validity of the classification and giving it a rating out of 100 according to its validity and for analysis

the  classes is  : "order" ,"discover menu", "order status"," complaint" . 

The income will be the classified conversation with its classification which will be in JSON format.

the conversation will be between ${delimiter1} characters  and JSON format is in ${delimiter2} characters .

Answer these questions with Y for yes and N for no for evaluation.

Start from the first question to the last question in order.

1 . Can a conversation tolerate more than one classification? ( Y or N only )
2 . Could the conversation belong to an unmentioned class? ( Y or N only )
3 . If he belongs to more than one class, is the relative distribution correct for him? ( Y or N only )
4 . Was the last message enough for analysis?  ( Y or N only )
5 . Can we adopt this classification?  ( Y or N only )
6 . Does the classification model need development?  ( Y or N only )

make sure the output in JSON format without any more word .

`;

    const messages = [
      { role: 'system', content: message },
      { role: 'user', content: `${delimiter1}${conversation}${delimiter1}` } ,
      {role: 'user' , content: `${delimiter2} ${json} ${delimiter2}`}
    ];

    try {
      const result = await getCompletionFromMessages(messages);
      callback(null, { result_json: result });
    } catch (err) {
      console.error("Error in gRPC method:", err.message);
      callback({
        code: grpc.status.INTERNAL,
        message: "Internal server error: " + err.message
      });
    }
  }
});





// Start server
const PORT = '0.0.0.0:50051';
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error("Server failed to start:", err.message);
    return;
  }
  console.log(`gRPC Node.js server running at ${PORT}`);
  server.start();
});
