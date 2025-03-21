import os
from dotenv import load_dotenv
import openai
load_dotenv()
# Your OpenAI key setup
client = openai.OpenAI(api_key=os.environ['OPENAI_API_KEY'])

def get_completion_from_messages(messages, 
                                 model="gpt-4-turbo", 
                                 temperature=0, 
                                 max_tokens=4096):
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,    
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content
