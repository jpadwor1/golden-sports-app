import ImageIcon from '@/components/Icons/image-icon';
import WordIcon from '@/components/Icons/word-icon';
import AdobeIcon from '@/components/Icons/adobe-icon';
import PowerpointIcon from '@/components/Icons/ppt-icon';
import ExcelIcon from '@/components/Icons/excel-icon';
import {File} from 'lucide-react';

export const getFileIcon = (fileName: string | undefined) => {
    if(!fileName) return <File className='h-6 w-6 text-blue-600 mr-2' />
    const extension = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase(): '';
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon />;
      case 'doc':
      case 'docx':
        return <WordIcon />;
      case 'ppt':
      case 'pptx':
        return <PowerpointIcon />;
      case 'xls':
      case 'xlsx':
        return <ExcelIcon />;
      case 'pdf':
        return <AdobeIcon />;
      default:
        return <File className='h-6 w-6 text-blue-600 mr-2' />;
    }
  };