
// import React, { useRef, useState } from 'react';

// interface OTPInputProps {
//   length?: number;
//   value: string;
//   onChange: (value: string) => void;
//   onComplete?: (value: string) => void;
// }

// const OTPInput: React.FC<OTPInputProps> = ({ 
//   length = 6, 
//   value, 
//   onChange,
//   onComplete 
// }) => {
//   const [focusedIndex, setFocusedIndex] = useState(0);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const handleChange = (index: number, digit: string) => {
//     if (!/^\d*$/.test(digit)) return;

//     const newValue = value.split('');
//     newValue[index] = digit;
//     const newOTP = newValue.join('');
    
//     onChange(newOTP);

//     if (digit && index < length - 1) {
//       inputRefs.current[index + 1]?.focus();
//       setFocusedIndex(index + 1);
//     }

//     if (newOTP.length === length && onComplete) {
//       onComplete(newOTP);
//     }
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Backspace') {
//       if (!value[index] && index > 0) {
//         inputRefs.current[index - 1]?.focus();
//         setFocusedIndex(index - 1);
//       }
//       const newValue = value.split('');
//       newValue[index] = '';
//       onChange(newValue.join(''));
//     } else if (e.key === 'ArrowLeft' && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//       setFocusedIndex(index - 1);
//     } else if (e.key === 'ArrowRight' && index < length - 1) {
//       inputRefs.current[index + 1]?.focus();
//       setFocusedIndex(index + 1);
//     }
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text').slice(0, length);
//     if (/^\d+$/.test(pastedData)) {
//       onChange(pastedData);
//       if (pastedData.length === length && onComplete) {
//         onComplete(pastedData);
//       }
//       inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
//     }
//   };

//   return (
//     <div className="flex gap-2 justify-center">
//       {Array.from({ length }).map((_, index) => (
//         <input
//           key={index}
//           ref={(el) => (inputRefs.current[index] = el)}
//           type="text"
//           inputMode="numeric"
//           maxLength={1}
//           value={value[index] || ''}
//           onChange={(e) => handleChange(index, e.target.value)}
//           onKeyDown={(e) => handleKeyDown(index, e)}
//           onPaste={handlePaste}
//           onFocus={() => setFocusedIndex(index)}
//           className={`
//             w-12 h-14 text-center text-2xl font-bold
//             border-2 rounded-lg
//             transition-all duration-200
//             ${focusedIndex === index 
//               ? 'border-primary-500 ring-2 ring-primary-200' 
//               : 'border-gray-300'
//             }
//             ${value[index] ? 'bg-primary-50' : 'bg-white'}
//             hover:border-primary-400
//             focus:outline-none
//           `}
//         />
//       ))}
//     </div>
//   );
// };

// export default OTPInput;

import React, { useRef, useState } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ 
  length = 6, 
  value, 
  onChange,
  onComplete 
}) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split('');
    newValue[index] = digit;
    const newOTP = newValue.join('');
    
    onChange(newOTP);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }

    if (newOTP.length === length && onComplete) {
      onComplete(newOTP);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
      const newValue = value.split('');
      newValue[index] = '';
      onChange(newValue.join(''));
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
      if (pastedData.length === length && onComplete) {
        onComplete(pastedData);
      }
      const lastIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            if (el) {
              inputRefs.current[index] = el;
            }
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setFocusedIndex(index)}
          className={`
            w-12 h-14 text-center text-2xl font-bold
            border-2 rounded-lg
            transition-all duration-200
            ${focusedIndex === index 
              ? 'border-primary-500 ring-2 ring-primary-200' 
              : 'border-gray-300'
            }
            ${value[index] ? 'bg-primary-50' : 'bg-white'}
            hover:border-primary-400
            focus:outline-none
          `}
        />
      ))}
    </div>
  );
};

export default OTPInput;