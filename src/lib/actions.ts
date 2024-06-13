import { getStorage, ref, uploadBytes, getDownloadURL,deleteObject  } from 'firebase/storage';
import { app } from '@/config/firebase';

export const startFileUpload = async ({ file }: { file: File | null }) => {
  if (!file) {
    alert('No file selected');
    return null;
  }

  const storage = getStorage(app);
  const storageRef = ref(storage,file.name);

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

export const deleteStorageFile = async (fileName: string) => {
  if (!fileName) {
    alert('No file name');
    return null;
  }

  const storage = getStorage(app);
  const storageRef = ref(storage,fileName);

  try {
    deleteObject(storageRef).then(()=> {
      console.log('File deleted successfully')
    })
  } catch (error) {
    console.error('Error deleting file:', error);
    return null; 
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

    const body = await response.json();

    if (!response.ok) {
      
      if (body.errors && body.errors.length > 0) {
        const errorMessages = body.errors
          .map((err: { message: any }) => err.message)
          .join(', ');
        throw new Error(errorMessages);
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    }

    return body; 
  } catch (error: any) {
    console.error('Failed to add user:', error);
    if (error.message === 'An existing user was found against the identity data provided.'){
      return 
    }
    throw error; 
  }
};

export  function formatDate(date: Date): string {
  const now = new Date();
  const inputDate = new Date(date);
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  const diffTime = now.getTime() - inputDate.getTime();
  const diffDays = Math.floor(diffTime / oneDayInMilliseconds);

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays === 2) {
    return '2 days ago';
  } else {
    return inputDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
