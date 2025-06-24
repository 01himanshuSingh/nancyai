import axios  from "axios";
const  geminiresponse= async (prompt:any)=>{
     const api_url = process.env.GEMINI_URL;
         try {
      const result = await axios.post(api_url!, {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      })
      return result.data;
      
       } catch (error: any) {
      console.error('Error calling Gemini API:', error)
      return { error: 'Error calling Gemini API' }

        }
}
export default geminiresponse;