'use client';


const page = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // const data = {
        //     name: formData.get('name'),
        //     email: formData.get('email'),
        //     password: formData.get('password'),
        // };

        const data = Object.fromEntries(formData.entries());
        console.log(data);
        console.log(typeof data);
    }



    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Registration Form</h1>       
            <form action="" onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" name="name" id="name"  className="border-2 border-gray-300 p-2 rounded-md " />
                <input type="email" name="email" id="email"  className="border-2 border-gray-300 p-2 rounded-md " />
                <input type="password" name="password" id="password"  className="border-2 border-gray-300 p-2 rounded-md " />  
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md ">Submit</button>
            </form>
        </div>
    )
}
export default page