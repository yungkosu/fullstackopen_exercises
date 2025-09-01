 const BlogForm = ({addBlog, newTitle, newAuthor, newUrl, handleTitleChange, handleAuthorChange, handleUrlChange}) => {
    return (
<form onSubmit={addBlog}>
<div>
title:<input 
        value={newTitle}
        onChange={handleTitleChange}/>

</div>
<div>
    author:
    <input
        value={newAuthor}
        onChange={handleAuthorChange}
      />
</div>

<div>
     url:<input
        value={newUrl}
        onChange={handleUrlChange}
      />
</div>

      <button type="submit">create</button>
    </form>  
  )
 }

 export default BlogForm