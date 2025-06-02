// Simple toast implementation since we're having issues with the import
export const useToast = () => {
  const toast = (props: {
    title: string;
    description: string;
    variant?: string;
  }) => {
    console.log(`Toast: ${props.title} - ${props.description}`);
    alert(`${props.title}: ${props.description}`);
  };

  return { toast };
};
