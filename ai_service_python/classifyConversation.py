import os
import openai

# Your OpenAI key setup
client = openai.OpenAI(api_key=os.environ['OPENAI_API_KEY'])

def get_completion_from_messages(messages, 
                                 model="gpt-3.5-turbo", 
                                 temperature=0, 
                                 max_tokens=500):
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,    
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content
