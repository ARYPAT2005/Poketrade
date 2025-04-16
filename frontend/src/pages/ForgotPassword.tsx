import { Button, Form, Card, Alert, InputGroup} from "react-bootstrap";
import { useNavigate } from 'react-router-dom'
import React, { useState } from "react";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [questions, setQuestions] = useState({ q1: "", q2: "" });
    const [answers, setAnswers] = useState({ a1: "", a2: "" });
    const [answerError, setAnswerError] = useState("");
    const [step, setStep] = useState(1); 
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Attempting to login...");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        try {
            if (step === 1) {
                // Enter the correct email, you get your security questions
                const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/check-email/`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
              
                if (!verifyResponse.ok) {
                  throw new Error("Email not found");
                }
              
                // get questions
                const questionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/user-security-questions/?email=${email}`);
                if (!questionsResponse.ok) {
                  throw new Error("Failed to get security questions");
                }
              
                const questionsData = await questionsResponse.json();
                console.log("Received questions:", questionsData); // Debug log
                
                setQuestions({
                  q1: questionsData.question1,
                  q2: questionsData.question2
                });
                setStep(2);
    
            } else if (step == 2) {
                // Verify the security questions are correct
                const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-security-answers/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify({
                        email,
                        answer1: answers.a1,
                        answer2: answers.a2
                    }),
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    throw new Error(data.error || "Verification failed");
                }
    
                if (!data.verified) {
                    throw new Error("One or more answers are incorrect");
                }
                setStep(3);
            } else if (step == 3) {
                // reset your password
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (newPassword !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                if (!passwordRegex.test(newPassword)) {
                    throw new Error(
                      "Password must be at least 8 characters long, contain an uppercase letter, " +
                      "a lowercase letter, a number, and a special character (@$!%*?&)."
                    );
                }
                // check if the user isn't using their old password
                const Oldresponse = await fetch(`${import.meta.env.VITE_API_URL}/check-old-password/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email,
                      new_password: newPassword
                    }),
                  });
          
                  const checkData = await Oldresponse.json();
          
                if (!Oldresponse.ok) {
                    throw new Error(checkData.error || "Password check failed");
                }
          
                if (checkData.is_same) {
                    throw new Error("New password cannot be the same as your old password");
                }
                // reset
                const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email,
                      new_password: newPassword
                    }),
                });
                
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ error: "Password reset failed" }));
                    throw new Error(error.error);
                }

                navigate('/login', { state: { message: "Password reset successfully! Please login." } });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "An error occurred";
            if (step === 1) {
                setEmailError(message);
            } else if (step === 2) {
                setAnswerError(message);
            } else {
                setPasswordError(message);
            }
        }
      };
        

    
// return (
//     <div>
//       <h1>Forgot Password</h1>
//       <Card style={{ maxWidth: "min(500px, 90%)", margin: "auto", marginTop: "50px",}}>
//         <Card.Body>
//             <Form onSubmit={handleSubmit}>

// import { Button, Form, Card, Alert, InputGroup } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import React, { useState } from "react";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [questions, setQuestions] = useState({ q1: "", q2: "" });
//   const [answers, setAnswers] = useState({ a1: "", a2: "" });
//   const [answerError, setAnswerError] = useState("");
//   const [step, setStep] = useState(1);
//   const navigate = useNavigate();
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordError, setPasswordError] = useState("");

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Attempting to login...");
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setEmailError("Please enter a valid email address");
//       return;
//     }
//     try {
//       if (step === 1) {
//         // Enter the correct email, you get your security questions
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//           throw new Error("Please enter a valid email address");
//         }

//         const response = await fetch("http://127.0.0.1:8000/get-security-questions/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         });

//         if (!response.ok) {
//           const error = await response.json().catch(() => ({ error: "Failed to fetch questions" }));
//           throw new Error(error.error);
//         }

//         const data = await response.json();
//         setQuestions({ q1: data.question1, q2: data.question2 });
//         setStep(2);
//       } else if (step == 2) {
//         // Verify the security questions are correct
//         const response = await fetch("http://127.0.0.1:8000/verify-security-answers/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email,
//             answer1: answers.a1,
//             answer2: answers.a2,
//           }),
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.error || "Verification failed");
//         }

//         if (!data.verified) {
//           throw new Error("One or more answers are incorrect");
//         }
//         setStep(3);
//       } else if (step == 3) {
//         // reset your password
//         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//         if (newPassword !== confirmPassword) {
//           throw new Error("Passwords do not match");
//         }
//         if (!passwordRegex.test(newPassword)) {
//           throw new Error(
//             "Password must be at least 8 characters long, contain an uppercase letter, " +
//               "a lowercase letter, a number, and a special character (@$!%*?&)."
//           );
//         }
//         // check if the user isn't using their old password
//         const Oldresponse = await fetch("http://127.0.0.1:8000/check-old-password/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email,
//             new_password: newPassword,
//           }),
//         });

//         const checkData = await Oldresponse.json();

//         if (!Oldresponse.ok) {
//           throw new Error(checkData.error || "Password check failed");
//         }

//         if (checkData.is_same) {
//           throw new Error("New password cannot be the same as your old password");
//         }
//         // reset
//         const response = await fetch("http://127.0.0.1:8000/reset-password/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email,
//             new_password: newPassword,
//           }),
//         });

//         if (!response.ok) {
//           const error = await response.json().catch(() => ({ error: "Password reset failed" }));
//           throw new Error(error.error);
//         }

//         navigate("/login", { state: { message: "Password reset successfully! Please login." } });
//       }
//     } catch (error) {
//       const message = error instanceof Error ? error.message : "An error occurred";
//       if (step === 1) {
//         setEmailError(message);
//       } else if (step === 2) {
//         setAnswerError(message);
//       } else {
//         setPasswordError(message);
//       }
//     }
//   };

  return (
    <div>
      <h1>Forgot Password</h1>
      <Card style={{ maxWidth: "min(500px, 90%)", margin: "auto", marginTop: "50px" }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {step === 1 ? (
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!emailError}
                  />

                  <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            ) : step === 2 ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>{questions.q1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={answers.a1}

                    onChange={(e) => setAnswers({ ...answers, a1: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{questions.q2}</Form.Label>
                  <Form.Control
                    type="text"
                    value={answers.a2}

                    onChange={(e) => setAnswers({ ...answers, a2: e.target.value })}
                    required
                  />
                </Form.Group>
                {answerError && (
                  <Alert variant="danger" className="mt-2">
                    {answerError}
                  </Alert>
                )}
              </>
            ) : (
                

              <>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                {passwordError && (
                  <Alert variant="danger" className="mt-2">
                    {passwordError}
                  </Alert>
                )}
              </>
            )}
            <Button variant="primary" type="submit">

              {step === 1 ? "Submit" : step === 2 ? "Verify Answers" : "Reset Password"}
            </Button>
          </Form>
          {/* DEBUGGING */}
          {/* {emailError && (
            <Alert variant="danger" style={{ marginTop: "10px" }}>
              {emailError}
            </Alert>
          )} */}

          {/* {answerError && (
            <Alert variant="danger" style={{ marginTop: "10px" }}>
              {answerError}
            </Alert>
          )} */}
        </Card.Body>

      </Card>
    </div>
  );
};
export default ForgotPassword;
