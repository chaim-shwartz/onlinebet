import React from 'react'
import '../styles/footer.css'

export default function Footer() {
  return (
    <div className='footer'>©️ This website created by Chaim Shwartz & Yakov Bader
      <br/>
      <br/>

      <div  className='resources'>

        <div className='chaimR'> 
          <h3>Chaim</h3>
          <div className='item'>
            <img src={require('../images/linkedin.png')}/>
            <a target='blank' href='https://www.linkedin.com/in/chaim-shwartz'><h4>LinkedIn</h4></a>
          </div>

          <div className='item'>
            <img src={require('../images/gh.png')}/>
            <a target='blank' href='https://github.com/chaim-shwartz'><h4>Git Hub</h4></a>
          </div>

        </div>

        <div className='yakovR'>
          <h3>Yakov</h3>
          <div className='item'>
              <img src={require('../images/linkedin.png')}/>
              <a target='blank' href='https://www.linkedin.com/in/chaim-shwartz'><h4>LinkedIn</h4></a>
            </div>

            <div className='item'>
              <img src={require('../images/gh.png')}/>
              <a target='blank' href='https://github.com/chaim-shwartz'><h4>Git Hub</h4></a>
            </div>
          </div>

      </div>
     
      
    </div>
  )
}
