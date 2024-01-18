import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '@/config/firebase';

export const startFileUpload = async ({ file }: { file: File | null }) => {
  if (!file) {
    alert('No file selected');
    return null;
  }

  const storage = getStorage(app);
  const storageRef = ref(storage, '/files/' + file.name);

  try {
    const snapshot = await uploadBytes(storageRef, file);

    // After a successful upload, get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { downloadURL, fileName: file.name, fileType: file.type }; // Return the download URL on success
  } catch (error) {
    console.error('Error uploading file:', error);
    return null; // Indicating an error occurred
  }
};

async function getAuthToken() {
  try {
    const response = await fetch(
      `https://goldensports.kinde.com/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          client_id: process.env.KINDE_CLIENT_ID || '',
          client_secret: process.env.KINDE_CLIENT_SECRET || '',
          grant_type: 'client_credentials',
          audience: `${process.env.KINDE_ISSUER_URL}/api`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get auth token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
}

export const addUser = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  let token;
  try {
    token = await getAuthToken();
    // Use the token for your subsequent API calls or other logic
  } catch (error) {
    console.error('Failed to get token:', error);
    throw error;
  }

  const [firstName, lastName] = name.split(' ');

  const inputBody = JSON.stringify({
    profile: {
      given_name: firstName,
      family_name: lastName || '',
    },
    identities: [
      {
        type: 'email',
        details: {
          email: email,
        },
      },
    ],
  });

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    AccessControlAllowOrigin: '*',
  };

  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/user`,
      {
        method: 'POST',
        body: inputBody,
        headers: headers,
      }
    );

    const body = await response.json(); // Parse the JSON body first

    if (!response.ok) {
      // Check if the response has the 'errors' field and handle accordingly
      if (body.errors && body.errors.length > 0) {
        const errorMessages = body.errors
          .map((err: { message: any }) => err.message)
          .join(', ');
        throw new Error(errorMessages);
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    }

    return body; // Return the response body for further processing
  } catch (error) {
    console.error('Failed to add user:', error);

    throw error; // Optionally re-throw the error for caller to handle
  }
};
