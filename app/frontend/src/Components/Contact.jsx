import React from 'react'
import "./Contact.css"
import Swal from 'sweetalert2';
function contact() {
    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    
        formData.append("access_key", "92b15813-68c2-4ccd-8d47-973cbc44a038");
    
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
    
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: json
        }).then((res) => res.json());
    
        if (res.success) {
          Swal.fire({
            title: "Query Sent!",
            text: "Query sent successfully!",
            icon: "success"
          });
        }
      };
  return (
    <section className='section h-screen dark:bg-slate-900'>
        <form onSubmit={onSubmit} className='box dark:bg-slate-800 dark:text-white'>
            <h2>Contact us</h2>
            <div className='inputbox '> 
                <label >First Name</label>
                <input type="text" className='field dark:text-white' name="name" placeholder='Enter your name' required/>
                
            </div>
            <div className='inputbox'> 
                <label >Email address</label>
                <input type="email" className='field dark:text-white' name="email" placeholder='Enter your email' required/>
                
            </div>
            <div className='box2'> 
              
                <textarea  className='fieldQuery border dark:bg-slate-700 w-72 p-2' name='Query' placeholder='Enter your Query' required/>
                
            </div>
                <div className="field">
            <button type='submit' className='dark:bg-blue-400  border-solid'>Send</button>
            </div>
        </form>
    </section>
  )
}

export default contact