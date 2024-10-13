import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai'; // Update this to your backend URL

const aiService = {
    async getAIResponse(messages) {
        try {
            const bankPolicies = await this.getBankPolicies();
            const policyContext = Object.entries(bankPolicies)
                .map(([bankName, policy]) => `${bankName} policy:\n${policy}`)
                .join('\n\n');
      
            const fullMessages = [
                { role: 'system', content: `You are a finance broker assistant. Use the following bank policies to inform your responses:\n\n${policyContext}` },
                ...messages
            ];
      
            const response = await axios.post(API_URL, { messages: fullMessages });
            return response.data.content;
        } catch (error) {
            console.error('Error calling AI service:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    async getBankPolicies() {
        try {
            const response = await axios.get('http://localhost:5000/api/banks');
            return response.data.reduce((acc, bank) => {
                acc[bank.name] = bank.policies.map((policy) => policy.text).join('\n\n');
                return acc;
            }, {});
        } catch (error) {
            console.error('Error fetching bank policies:', error);
            return {};
        }
    }
};

export default aiService;