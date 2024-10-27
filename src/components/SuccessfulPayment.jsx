import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify'; // Update the import statement

export default function SuccessfulPayment({playerInfo}) {
    const callLambdaFunction = async () => {
        try {
            const response = await Amplify.API.post('virtualcars', '/src/processPayment/index.js', {
                body: { userId: playerInfo.id } // Pass the user ID to identify the user
            });
            console.log('User money updated:', response);
        } catch (error) {
            console.error('Error updating user money:', error);
        }
    };

    const handleButtonClick = () => {
        callLambdaFunction();
    };

    return (
        <div>
            <div>Successful Payment</div>
            <button onClick={handleButtonClick}>Update User Money</button>
        </div>
    );
}
