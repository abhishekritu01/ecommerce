import Nav from "./_componets/Nav";
import Hero from "./_componets/Hero"
import Content from './_componets/Content'

const page =() =>{
    return(
        <div className="container mx-auto p-2 flex flex-col gap-8 overflow-x-scroll ">
            <Nav/>
            <Hero />
            <Content />
        </div>
    )
}
export default page;