const BlogList = (props) => {
    const blogs=props.blogs;
    const handleDelete=props.handleDelete;
    return ( 
        <div className="blog-list">
            {blogs.map((blog)=>(
                <div className="blog-preview" key={blogs.id}>
                    <h2>
                        {blog.title}
                    </h2>
                    <p>
                        written by {blog.author}
                    </p>
                    <button onClick={()=> handleDelete(blog.id)}>delete blog</button>
                </div>
            ))}
        </div>
     );
}
 
export default BlogList;