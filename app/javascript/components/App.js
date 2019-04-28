import React from 'react'
import {Container, Form, Loader, Header} from 'semantic-ui-react'
import TableList from './TableList'
import HistogramChart from './data_visualization/HistogramChart'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tables: []
    };
  }

  handleChange = (event, {name, value}) => this.setState({[name]: value})

  handleSubmit = () => {
    const { databaseUrl } = this.state;

    this.setState({loading: true});

    fetch('/api/v1/table', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({databaseUrl})
    }).then(response => {
      return response.json();
    }).then((data) => {
      this.setState({loading: false});
      this.setState({tables: data})
    })
  }

  render () {
    let simpleNumberDistribution = '{100, 500, 1000, 1200, 7000, 7100, 7150, 9000}'
    let numberDistribution = '{1,200,509,909,1307,1703,2003,2203,2403,2603,2803,3002,3202,3402,3601,3801,4001,4201,4400,4600,4800,4999,5199,5399,5599,5798,5998,6198,6397,6597,6797,6997,7196,7396,7596,7795,7995,8195,8394,8594,8794,8994,9193,9393,9593,9792,9992,10192,10392,10591,10791,10991,11190,11390,11590,11790,11989,12189,12389,12588,12788,12988,13188,13387,13587,13787,13986,14186,14386,14585,14785,14985,15185,15384,15584,15784,15983,16183,16383,16583,16782,16982,17182,17381,17581,17781,17981,18180,18380,18580,18779,18979,19179,19379,19578,19778,19978,20177,20377,20577,20777}'
    let stringDistribution = '{A.,Ajay,Alexandria,Alfredo,Allison,Amy,Andrew,Ann,Arianna,Arturo,Bailey,Billy,Brandi,Brian,Brooke,Byron,Carl,Carolyn,Cassandra,Cedric,Chris,Cindy,Clifford,Colleen,Cristian,Dale,Danielle,Dawn,Deena,Devon,Donals,Ebony,Edwin,Erin,Evelyn,Frank,Gabriella,George,Gina,Guy,Heidi,Isabel,Jaclyn,Jada,Janelle,Jeff,Jeremiah,Jerry,Jill,Jocelyn,Johnny,Jorge,Juan,Kara,Karla,Katie,Kaylee,Kelsey,Kimberly,Kristina,Kyley,Latoya,Leslie,Lisa,Lynn,Mandy,Mariah,Mark,Mary,Maurice,Melanie,Meredith,Min,Monica,Nathaniel,Nieves,Ovidiu,Patrick,Philip,Rafael,Raul,Reginald,Rob,Rosa,Ruben,Samantha,Savannah,Shannon,Sheena,Spencer,Steve,Suzanne,Tanya,Terry,Timothy,Tonya,Tristan,Veronica,Warren,William,Zoe}'
    let dateDistribution = '{"2006-06-23 00:00:00","2008-12-24 00:00:00","2009-02-01 00:00:00","2009-12-30 00:00:00","2011-06-08 00:00:00","2011-07-10 00:00:00","2011-08-09 00:00:00","2011-09-08 00:00:00","2011-10-05 00:00:00","2011-10-31 00:00:00","2011-11-18 00:00:00","2011-12-11 00:00:00","2011-12-28 00:00:00","2012-01-19 00:00:00","2012-02-03 00:00:00","2012-02-22 00:00:00","2012-03-17 00:00:00","2012-04-06 00:00:00","2012-04-28 00:00:00","2012-05-20 00:00:00","2012-06-09 00:00:00","2012-06-28 00:00:00","2012-07-16 00:00:00","2012-08-02 00:00:00","2012-08-25 00:00:00","2012-09-15 00:00:00","2012-10-05 00:00:00","2012-10-28 00:00:00","2012-11-10 00:00:00","2012-11-24 00:00:00","2012-12-12 00:00:00","2012-12-31 00:00:00","2013-01-16 00:00:00","2013-02-01 00:00:00","2013-02-16 00:00:00","2013-03-06 00:00:00","2013-03-22 00:00:00","2013-04-04 00:00:00","2013-04-20 00:00:00","2013-05-02 00:00:00","2013-05-17 00:00:00","2013-06-02 00:00:00","2013-06-24 00:00:00","2013-07-04 00:00:00","2013-07-09 00:00:00","2013-07-14 00:00:00","2013-07-27 00:00:00","2013-08-04 00:00:00","2013-08-12 00:00:00","2013-08-19 00:00:00","2013-08-24 00:00:00","2013-09-01 00:00:00","2013-09-07 00:00:00","2013-09-11 00:00:00","2013-09-19 00:00:00","2013-09-26 00:00:00","2013-09-30 00:00:00","2013-10-05 00:00:00","2013-10-10 00:00:00","2013-10-14 00:00:00","2013-10-21 00:00:00","2013-10-25 00:00:00","2013-11-01 00:00:00","2013-11-08 00:00:00","2013-11-16 00:00:00","2013-11-21 00:00:00","2013-11-26 00:00:00","2013-12-04 00:00:00","2013-12-11 00:00:00","2013-12-16 00:00:00","2013-12-22 00:00:00","2013-12-28 00:00:00","2014-01-02 00:00:00","2014-01-06 00:00:00","2014-01-11 00:00:00","2014-01-15 00:00:00","2014-01-23 00:00:00","2014-01-30 00:00:00","2014-02-04 00:00:00","2014-02-11 00:00:00","2014-02-16 00:00:00","2014-02-22 00:00:00","2014-02-26 00:00:00","2014-03-05 00:00:00","2014-03-10 00:00:00","2014-03-16 00:00:00","2014-03-21 00:00:00","2014-03-26 00:00:00","2014-04-02 00:00:00","2014-04-13 00:00:00","2014-04-21 00:00:00","2014-04-28 00:00:00","2014-05-03 00:00:00","2014-05-10 00:00:00","2014-05-18 00:00:00","2014-05-24 00:00:00","2014-05-29 00:00:00","2014-06-06 00:00:00","2014-06-15 00:00:00","2014-06-23 00:00:00","2015-04-15 16:33:33.123"}'
    let guidDistribution = `{000b8d5e-6c0a-456b-9d4c-94bfc05e2d24,02b2d658-c66e-42e0-a682-a030069073e7,05398f57-15d1-479a-ad8e-040a0bf9f517,0797301a-08e7-4a1e-8cd7-5d62c522bb18,0a1f3fe1-ddcd-426e-a812-00126c299055,0ccdee5f-5a74-47d8-a369-90eae4735af6,0f4aa341-21e9-4c91-836e-1463c676a4ba,11a8788f-ace6-447a-ab3b-7b562fb3653c,14a1b8f7-a7d6-4f38-b21e-b0aee98af4d4,177006f6-b7af-45da-8db5-4b365af156d9,19d7ed99-ecc9-4f02-8b93-079601b057bf,1c751775-bfec-4116-a0dc-2fa00ef68608,1f1d4247-1ef2-4b12-9f77-7562a587ad4b,21a1072b-005f-4d1b-8960-54b76c04d363,2445bf87-3b89-4b77-a56f-b6c61b332661,27109cf6-2f9b-4481-97f3-a37f295d5e4f,29a3d3cc-9491-467c-96b3-82d9b85c2c95,2c34c039-41d5-4870-8a0c-c98b71e57b56,2eaaaab2-9b77-4c63-b2b8-c6759742d328,316162af-b3fe-4502-8c23-82ad12f3c214,340af7b4-7ba7-4565-95bc-8f3c078674d5,369591cc-6ea5-4586-bf0d-a45b0d23632a,3923aad4-fbf3-44a2-bbb4-7541ea59499a,3bc6864d-4d40-4bbe-b483-8753254c4d98,3e1a63c8-8dd0-4d34-a001-862d1c8f0f08,40637d44-30d0-4f5c-8392-59650b281c28,42dce2cf-fa2d-40fa-93e9-020e11438d63,45b6f32e-521b-48c8-b4d9-fd0bd25ee23b,48136d93-6494-4e35-8ad9-aeafa8debc66,4a9ac506-4996-4b11-9aef-c9b5b49b26b6,4d13463f-446f-47f5-9564-91dd8debb006,4fa529f0-961a-45fe-868c-a448260f7997,522fbfc8-9353-40f1-bf63-e34df10215ac,54e9fec0-2ddb-453f-b738-14f807aa1fb7,5794e6ce-9497-4da7-8e6f-abf2c739692e,5a201a8f-796c-4a51-bb73-812a94779ad1,5c7c0649-caa8-499c-a7cc-c85917d93a3e,5efe5346-cfb2-4b01-955b-9f31e5d6b552,619f4688-4e30-45b9-ac2f-4f0b224da164,643549ec-6e71-4f29-a96b-c438db69219b,66be7bc7-956c-4c1e-a57b-d86cbcc85558,690bf6bc-91ac-4c2e-9293-f4dda178fa3f,6bad6da9-a57e-48be-9284-7daddf0b5791,6e11c3a9-ba8d-4e28-b371-b568d24ff086,709b71b0-e2cf-4561-8ce3-17a2b6d0afbb,72c7bec9-a05a-4ca1-ad7b-4e72f7437f5a,757b57c3-64e3-4953-8c49-ed5a892b6b44,77e398bb-f689-43e3-a6fe-a82c7b5a059d,7a9a0deb-894e-45ea-a683-9eb2a0edf98a,7d2fd74b-a33f-445f-bdc3-e035c5accf95,7fa86a7b-523b-40c7-be5c-04b6fa4c673a,8233499c-9505-4dc1-8f58-1342dcbc58c3,84b9b2d1-c0dc-41b1-9f98-8517ba9c7466,87775e2a-41f2-47f4-bb29-d133b5f2f01d,8a3042c1-e0ab-482a-ae0c-37a27994c5ec,8cbd04de-e27b-447f-a9a7-0c288edf801b,8f2e7035-5d8e-4509-870b-81b11a3c3c20,91c47d62-6d48-40c3-8cc1-310f7adb50ea,94d0fb1c-a279-4608-8bc0-d6e205f9460f,9723b504-0e07-446d-925a-2a85339da896,9a0690ec-c384-41d1-a710-d57476384060,9cffa6fb-e83a-4b78-b485-8009b60e88c2,9f61a468-c907-422b-a457-7e3ab2f4edfa,a22d38ff-6d01-458b-948a-049f51759f97,a49d61a3-a381-4442-9d17-51f9bf914409,a70f010e-11fd-40b9-affa-9f0e58b85670,a99a3523-1fef-4137-9c2c-1cf548129e3b,ac23b8aa-7c82-4a53-896c-1daa17bfdd8b,aedddb00-6ee5-481a-bf00-593ea7659312,b1584504-6371-455f-938a-0cdf46ef226e,b3d2b279-3d13-4ae6-9163-7f4aae2a8ed6,b66ee5ca-aa31-4ad2-bd90-506e841cc4c9,b8d68274-33af-48b5-a5fa-62f67b20c311,bb47520a-5b74-4b97-b3c3-12fa05e1047b,bda87bb6-7c2a-4d07-882e-0e434b11aae4,c057ea6e-855c-4b95-844a-efa0ac93c2ad,c2f0956d-115a-41a3-8912-0177a1e13634,c553f517-2402-4e44-9315-1945bb0f59f1,c7ebffc8-1c91-4af6-81b8-a17139ec88ec,ca7029f8-ccd7-435e-bb16-464a82970bf4,cd214095-5b91-4f23-9f61-e3e6cd3c04eb,cff46c05-8b0d-4db4-a126-911372baab53,d23a86d8-0fbb-45f8-a2b1-3e9baab01db6,d51513fc-e325-4c67-bdfe-03ca9d7744c7,d7a87920-4008-471a-a5f0-55664e104b25,da799c7c-b0e5-444c-8d45-1a9c2fb04f13,dcea9cdd-d446-4a17-9f02-d56e42624a4b,df9c6a11-c10e-432b-a2ec-3a031480c989,e1ebb0b0-b229-4fd4-bb2a-fb0cc9164ffe,e424f402-1433-47b8-b558-f914f267e05f,e65e93ef-dd38-4405-88d6-5058dd82b7b9,e908a0e1-6361-48fa-a6e0-9ec1039673dd,eb744073-850b-4c82-b353-a1c55b6470bd,ee14d008-f4b2-48e1-a910-9ffb08cda5f9,f07666fe-cf67-4e89-b14f-d27078c31941,f2c9dbef-6e31-47f3-963b-75c70ab68c26,f599ebf1-0908-4b04-8822-98af4b9d7003,f8738bea-96ba-418c-aae9-eb8289325261,fb05fa6c-0062-4164-86f7-655c0b6a61bf,fdaeea9e-4793-4961-9dfd-52c9cc1f1e16,ffff4abd-7de0-42a9-855d-26e06d94fa4d}`

    return (
      <Container>
        <Header as='h3'>Date distribution</Header>
        <HistogramChart data={{histogram_bounds: dateDistribution}} />
        <Header as='h3'>Simple number distribution</Header>
        <HistogramChart data={{histogram_bounds: simpleNumberDistribution}} />
        <Header as='h3'>Number distribution</Header>
        <HistogramChart data={{histogram_bounds: numberDistribution}} />
        <Header as='h3'>String distribution</Header>
        <HistogramChart data={{histogram_bounds: stringDistribution}} />
        <Header as='h3'>Guid distribution</Header>
        <HistogramChart data={{histogram_bounds: guidDistribution}} />
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Input name='databaseUrl' placeholder='Connection string' onChange={this.handleChange}/>
            <Form.Button>Submit</Form.Button>
          </Form.Group>
        </Form>
        { this.state.loading && <Loader active inline='centered' /> }
        { this.state.tables.length > 0 && <TableList databaseUrl={this.state.databaseUrl} tables={this.state.tables}/>}
      </Container>
    )
  }
}

export default App
